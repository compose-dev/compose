import { describe, expect, it } from "vitest";
import { mockRunner, ApiEventTracker } from "../appRunner.testUtils";
import { SdkToServerEvent, UI } from "@composehq/ts-public";

describe("App Runner - Auto Pagination Table", () => {
  it("should return the first 100 rows when auto paginated", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.table(
          "table",
          Array.from({ length: 5001 }, (_, i) => ({ id: i }))
        )
      );
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RENDER_UI_V2) {
          const ui = event.ui;

          if (ui.type !== UI.TYPE.INPUT_TABLE) {
            return false;
          }

          if (ui.model.id !== "table") {
            return false;
          }

          if (ui.model.properties.data.length === 100) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("should return first 100 rows when auto paginated and table is nested", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.stack([
          ui.stack([]),
          ui.stack([
            ui.table(
              "table",
              Array.from({ length: 5001 }, (_, i) => ({ id: i }))
            ),
          ]),
        ])
      );
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RENDER_UI_V2) {
          // @ts-expect-error ignore the type error here
          const ui = event.ui.model.children[1].model
            .children[0] as UI.ComponentGenerators.All;

          if (ui.type !== UI.TYPE.INPUT_TABLE) {
            return false;
          }

          if (ui.model.id !== "table") {
            return false;
          }

          if (ui.model.properties.data.length === 100) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("search disabled for auto paginated table", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.stack([
          ui.stack([]),
          ui.stack([
            ui.table(
              "table",
              Array.from({ length: 5001 }, (_, i) => ({ id: i }))
            ),
          ]),
        ])
      );
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RENDER_UI_V2) {
          // @ts-expect-error ignore the type error here
          const ui = event.ui.model.children[1].model
            .children[0] as UI.ComponentGenerators.All;

          if (ui.type !== UI.TYPE.INPUT_TABLE) {
            return false;
          }

          if (ui.model.id !== "table") {
            return false;
          }

          if (ui.model.properties.notSearchable === true) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("selections disabled for auto paginated table", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.stack([
          ui.stack([]),
          ui.stack([
            ui.table(
              "table",
              Array.from({ length: 5001 }, (_, i) => ({ id: i }))
            ),
          ]),
        ])
      );
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RENDER_UI_V2) {
          // @ts-expect-error ignore the type error here
          const ui = event.ui.model.children[1].model
            .children[0] as UI.ComponentGenerators.All;

          if (ui.type !== UI.TYPE.INPUT_TABLE) {
            return false;
          }

          if (ui.model.id !== "table") {
            return false;
          }

          if (ui.model.properties.allowSelect === false) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });
});
