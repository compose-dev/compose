import { describe, it, expect } from "vitest";
import { AppRunner } from "../appRunner";
import { AppDefinition } from "../../appDefinition";
import { SdkToServerEvent, UI } from "@composehq/ts-public";

import { ApiEventTracker, mockRunner } from "./appRunner.testUtils";

describe("AppRunner", () => {
  it("should be initialized with empty values", () => {
    const { appRunner } = mockRunner();
    expect(appRunner.renders).toEqual([]);
    expect(appRunner.rendersById).toEqual({});
    expect(appRunner.confirmationDialog).toEqual(null);
  });

  it("should error on infinite recursion", async () => {
    let receivedError = false;

    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      function recursiveStack(depth: number): any {
        if (depth > 100000000) {
          return ui.text("beep");
        }

        return ui.stack(recursiveStack(depth + 1));
      }

      page.add(recursiveStack(0));
    });

    new ApiEventTracker(api, {
      onEvent: (event) => {
        if (event.type === SdkToServerEvent.TYPE.APP_ERROR_V2) {
          receivedError = true;
        }
      },
    });

    await appRunner.execute({});

    expect(receivedError).toEqual(true);
  });

  it("should properly defer state updates", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui, state }) => {
      state.overwrite({
        processing: false,
      });

      page.add(() =>
        ui.cond(state.processing === true, {
          true: ui.text("YES processing"),
          false: ui.text("NO processing"),
        })
      );

      state.processing = true;
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) =>
        event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3 &&
        JSON.stringify(event).includes("YES processing"),
    });

    await appRunner.execute({});

    await tracker.waitUntilCondition({ timeoutMs: 15 });

    expect(tracker.metCondition).toEqual(true);
  });

  it("state is initialized as an empty object", async () => {
    let appState: any = null;

    const { appRunner } = mockRunner(({ page, ui, state }) => {
      appState = state;
    });

    await appRunner.execute({});

    expect(appState).toEqual({});
  });

  it("should pass initial state to the runner", async () => {
    const { api } = mockRunner();

    let appState: any = null;

    const appDefinition = new AppDefinition({
      name: "Test App",
      route: "test-app",
      handler: ({ page, ui, state }) => {
        appState = state.hello;
      },
      initialState: {
        hello: "world",
      },
    });

    const appRunner = new AppRunner(
      appDefinition as unknown as AppDefinition,
      api,
      "fake-execution-id",
      "fake-browser-session-id"
    );

    await appRunner.execute({});

    expect(appState).toEqual("world");
  });

  /**
   * When a user sets initial state, we need to ensure that every execution
   * gets a fresh copy of the state. Previously, we had a bug where editing
   * the state in one execution was editing the underlying initialState object,
   * which was then being used for all future executions.
   */
  it("state is re-initialized across executions", async () => {
    const { api } = mockRunner();

    const appStates: number[] = [];

    const appDefinition = new AppDefinition({
      name: "Test App",
      route: "test-app",
      handler: ({ page, ui, state }) => {
        appStates.push(state.count);
        state.count = state.count + 1;
      },
      initialState: {
        count: 0,
      },
    });

    const runnerOne = new AppRunner(
      appDefinition as unknown as AppDefinition,
      api,
      "fake-execution-id",
      "fake-browser-session-id"
    );
    await runnerOne.execute({});

    const runnerTwo = new AppRunner(
      appDefinition as unknown as AppDefinition,
      api,
      "fake-execution-id2",
      "fake-browser-session-id2"
    );
    await runnerTwo.execute({});

    expect(appStates[0]).toEqual(0);
    expect(appStates[1]).toEqual(0);
  });

  it("should update component when state is updated", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui, state }) => {
      state.count = 0;
      page.add(() => ui.text(state.count.toString()));
      state.count = state.count + 1;
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3) {
          if (tracker.renders.length === 0) {
            return false;
          }

          const { renderId, rootComponentId } = tracker.renders[0];

          const update = event.diff[renderId].update[rootComponentId];
          if (
            update &&
            "text" in update.properties &&
            update.properties.text === "1"
          ) {
            return true;
          }
        }

        return false;
      },
    });

    await appRunner.execute({});

    await tracker.waitUntilCondition({ timeoutMs: 15 });

    expect(tracker.oneRenderOrMore).toEqual(true);
    expect(tracker.metCondition).toEqual(true);
  });

  it("should delete/add component when state is updated", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui, state }) => {
      state.count = 0;
      page.add(() => {
        if (state.count === 0) {
          return ui.text("0");
        }

        return ui.header("1");
      });
      state.count = state.count + 1;
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (tracker.renders.length === 0) {
          return false;
        }

        const { renderId, rootComponentId } = tracker.renders[0];

        if (event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3) {
          if (!renderId || !rootComponentId) {
            return false;
          }

          const add = event.diff[renderId].add;
          const deleteArr = event.diff[renderId].delete;

          const didDeleteCorrectly =
            deleteArr &&
            deleteArr.length === 1 &&
            deleteArr[0] === rootComponentId;

          const didAddCorrectly =
            add &&
            Object.keys(add).length === 1 &&
            Object.values(add)[0].type === UI.TYPE.DISPLAY_HEADER;

          if (didDeleteCorrectly && didAddCorrectly) {
            return true;
          }
        }

        return false;
      },
    });

    await appRunner.execute({});

    await tracker.waitUntilCondition();

    expect(tracker.oneRenderOrMore).toEqual(true);
    expect(tracker.metCondition).toEqual(true);
  });

  it("should do nothing when state update doesn't change anything", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui, state }) => {
      state.initial = "initial";
      state.count = 0;
      page.add(() => ui.text(state.initial, { style: { color: "red" } }));
      state.count = state.count + 1;

      page.add(() => ui.header(state.count.toString()));
      state.count = state.count + 1;
    });

    // Essentially we can make sure the update is running correctly by ensuring the text component
    // is never updated, which we check by seeing if there's a style object in the update.
    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3) {
          const renderId = Object.keys(event.diff)[0];

          const updateComponent = Object.values(event.diff[renderId].update)[0];

          const isStyleDefined =
            updateComponent.style !== null &&
            updateComponent.style !== undefined;

          if (isStyleDefined) {
            return false;
          } else {
            return true;
          }
        }

        return false;
      },
    });

    await appRunner.execute({});

    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });
});
