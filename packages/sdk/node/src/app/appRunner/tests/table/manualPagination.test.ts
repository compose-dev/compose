import { describe, expect, it } from "vitest";
import { mockRunner, ApiEventTracker } from "../appRunner.testUtils";
import { SdkToServerEvent, UI } from "@composehq/ts-public";

describe("App Runner - Manual Pagination Table", () => {
  it("should initially return 0 rows for manually paginated table", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.table("table", ({ offset, pageSize, searchQuery }) => {
          const data = Array.from({ length: 5001 }, (_, i) => ({ id: i }));
          return {
            data: data.slice(offset, offset + pageSize),
            totalRecords: data.length,
          };
        })
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

          if (ui.model.properties.data.length === 0) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("should initially return 0 rows for manually paginated table nested in a stack", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.stack([
          ui.stack([]),
          ui.stack([
            ui.table("table", ({ offset, pageSize, searchQuery }) => {
              const data = Array.from({ length: 5001 }, (_, i) => ({ id: i }));
              return {
                data: data.slice(offset, offset + pageSize),
                totalRecords: data.length,
              };
            }),
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

          if (ui.model.properties.data.length === 0) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("should send a stale message on load for manually paginated table", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.table("table", ({ offset, pageSize, searchQuery }) => {
          const data = Array.from({ length: 5001 }, (_, i) => ({ id: i }));
          return {
            data: data.slice(offset, offset + pageSize),
            totalRecords: data.length,
          };
        })
      );
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.STALE_STATE_UPDATE_V2) {
          if (
            event.componentId === "table" &&
            event.stale === "INITIALLY_STALE"
          ) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("should send a stale message on load for manually paginated table nested in a stack", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.stack([
          ui.stack([]),
          ui.stack([
            ui.table("table", ({ offset, pageSize, searchQuery }) => {
              const data = Array.from({ length: 5001 }, (_, i) => ({ id: i }));
              return {
                data: data.slice(offset, offset + pageSize),
                totalRecords: data.length,
              };
            }),
          ]),
        ])
      );
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.STALE_STATE_UPDATE_V2) {
          if (
            event.componentId === "table" &&
            event.stale === "INITIALLY_STALE"
          ) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("should return 100 rows for manually paginated table", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.table("table", ({ offset, pageSize, searchQuery }) => {
          const data = Array.from({ length: 5001 }, (_, i) => ({ id: i }));
          return {
            data: data.slice(offset, offset + pageSize),
            totalRecords: data.length,
          };
        })
      );
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (
          event.type === SdkToServerEvent.TYPE.TABLE_PAGE_CHANGE_RESPONSE_V2
        ) {
          if (event.data.length === 100) {
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
