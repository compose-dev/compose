import { Generator, UI } from "@composehq/ts-public";
import { describe, expect, test } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { transformComponent } from "~/utils/appStore/transformComponent.testUtils";
import { appStore } from "~/utils/appStore";

describe("addRender", () => {
  test("adds a basic render to the app state", () => {
    const { result: appState } = renderHook(() => appStore.use());
    const { result: rendersState } = renderHook(() => appStore.useRenders());

    const { componentGenerator } = transformComponent(
      Generator.display.text("hello world")
    );

    act(() => {
      rendersState.current.addRender("1", 0);
    });

    act(() => {
      appState.current.dispatch({
        type: appStore.EVENT_TYPE.ADD_RENDER,
        properties: {
          renderId: "1",
          ui: componentGenerator,
          renders: rendersState.current.rendersRef.current,
          appearance: "default",
          modalHeader: undefined,
          modalWidth: undefined,
        },
      });
    });

    const renders = appState.current.renders;
    const renderToRootComponent = appState.current.renderToRootComponent;
    const rootComponentId = componentGenerator.model.id;

    expect(renders.length).toEqual(1);
    expect(renders[0]).toEqual("1");
    expect(renderToRootComponent["1"]).toEqual(rootComponentId);
  });

  test("v1 table network transfer value is the rows themselves", () => {
    const { result: appState } = renderHook(() => appStore.use());
    const { result: rendersState } = renderHook(() => appStore.useRenders());

    const secondObject = {
      id: "2",
      name: "row 2",
    };

    const { componentGenerator } = transformComponent(
      Generator.input.table(
        "table",
        [
          {
            id: "1",
            name: "row 1",
          },
          {
            ...secondObject,
          },
        ],
        {
          initialSelectedRows: [1],
        }
      ),
      {
        compress: false,
      }
    );

    // simulating what it was like before 0.22.0 SDK
    delete componentGenerator.model.properties.v;

    act(() => {
      rendersState.current.addRender("1", 0);
    });

    act(() => {
      appState.current.dispatch({
        type: appStore.EVENT_TYPE.ADD_RENDER,
        properties: {
          renderId: "1",
          ui: componentGenerator,
          renders: rendersState.current.rendersRef.current,
          appearance: "default",
          modalHeader: undefined,
          modalWidth: undefined,
        },
      });
    });

    const tableOutput = appState.current.flattenedOutput["1"][
      "table"
    ] as appStore.FrontendComponentOutput.WithInputInteraction;

    const networkTransferValue = tableOutput.output
      .networkTransferValue as UI.Components.InputTable["output"]["networkTransferValue"];

    // @ts-expect-error don't care about the type here since it's a test anyway
    expect(networkTransferValue.length).toEqual(1);
    // @ts-expect-error don't care about the type here since it's a test anyway
    expect(JSON.stringify(networkTransferValue[0])).toEqual(
      JSON.stringify(secondObject)
    );
  });

  test("v2 table network transfer value is the rows themselves", () => {
    const { result: appState } = renderHook(() => appStore.use());
    const { result: rendersState } = renderHook(() => appStore.useRenders());

    const { componentGenerator } = transformComponent(
      Generator.input.table(
        "table",
        [
          {
            id: "1",
            name: "row 1",
          },
          {
            id: "2",
            name: "row 2",
          },
        ],
        {
          initialSelectedRows: [1],
        }
      )
    );

    act(() => {
      rendersState.current.addRender("1", 0);
    });

    act(() => {
      appState.current.dispatch({
        type: appStore.EVENT_TYPE.ADD_RENDER,
        properties: {
          renderId: "1",
          ui: componentGenerator,
          renders: rendersState.current.rendersRef.current,
          appearance: "default",
          modalHeader: undefined,
          modalWidth: undefined,
        },
      });
    });

    const tableOutput = appState.current.flattenedOutput["1"][
      "table"
    ] as appStore.FrontendComponentOutput.WithInputInteraction;

    const networkTransferValue = tableOutput.output
      .networkTransferValue as UI.Components.InputTable["output"]["networkTransferValue"];

    // @ts-expect-error don't care about the type here since it's a test anyway
    expect(networkTransferValue.value.length).toEqual(1);
    // @ts-expect-error don't care about the type here since it's a test anyway
    expect(networkTransferValue.value[0]).toEqual(1);
  });
});
