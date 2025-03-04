import { describe, expect, it } from "vitest";
import { mockRunner, ApiEventTracker } from "../appRunner.testUtils";
import { SdkToServerEvent, UI } from "@composehq/ts-public";

describe("App Runner - Table", () => {
  it("should return an empty table if no data is provided", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() => ui.table("table", []));
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

  it("should return an empty table when nested", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.stack([ui.stack([]), ui.stack([ui.table("table", [])])])
      );
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RENDER_UI_V2) {
          // @ts-expect-error ignore the type error here
          const table = event.ui.model.children[1].model
            .children[0] as UI.ComponentGenerators.All;

          if (table.type !== UI.TYPE.INPUT_TABLE) {
            return false;
          }

          if (table.model.id !== "table") {
            return false;
          }

          if (table.model.properties.data.length === 0) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("should return 5000 rows when data is provided", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.table(
          "table",
          Array.from({ length: 5000 }, (_, i) => ({ id: i }))
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

          if (ui.model.properties.data.length === 5000) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("selections are enabled by default", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.table(
          "table",
          Array.from({ length: 100 }, (_, i) => ({ id: i }))
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

          if (ui.model.properties.allowSelect === true) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("should return 5000 rows when data is provided and table is nested", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.stack([
          ui.stack([]),
          ui.stack([
            ui.table(
              "table",
              Array.from({ length: 5000 }, (_, i) => ({ id: i }))
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

          if (ui.model.properties.data.length === 5000) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("table data is compressed", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.stack([
          ui.stack([]),
          ui.stack([
            ui.table(
              "table",
              Array.from({ length: 5000 }, (_, i) => ({
                id: i,
                beepboop: "random",
                thirdboi: "third",
              })),
              {
                columns: [
                  { key: "id", label: "ID" },
                  { key: "beepboop", label: "Beepboop", format: "string" },
                ],
              }
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

          const columns = ui.model.properties.columns;

          if (!columns || columns.length !== 2) {
            return false;
          }

          const first = columns[0];
          const second = columns[1];

          if (typeof first === "string" || typeof second === "string") {
            return false;
          }

          const firstCorrect = first.key === "0" && first.original === "id";
          const secondCorrect =
            second.key === "1" &&
            second.original === "beepboop" &&
            second.format === "string";

          const dataRow = ui.model.properties.data[0];
          const rowCorrect =
            dataRow["0"] === 0 &&
            dataRow["1"] === "random" &&
            Object.keys(dataRow).length === 2;

          return firstCorrect && secondCorrect && rowCorrect;
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("should update when table data changes", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      const data = Array.from({ length: 5000 }, (_, i) => ({ id: i }));

      page.add(() =>
        ui.stack([ui.stack([]), ui.stack([ui.table("table", data)])])
      );

      data[150] = { id: 199 };
      page.update();
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3) {
          const key = Object.keys(event.diff)[0];
          const update = event.diff[key].update.table.properties;

          // @ts-expect-error type error
          // remember that table data is compressed
          if (update.data[150]["0"] === 199) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("the updated data should be compressed", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      const data = Array.from({ length: 5000 }, (_, i) => ({
        id: i,
        beepboop: "random",
        thirdboi: "third",
      }));

      page.add(() =>
        ui.stack([
          ui.stack([]),
          ui.stack([
            ui.table("table", data, {
              columns: [
                { key: "id", label: "ID" },
                { key: "beepboop", label: "Beepboop", format: "string" },
              ],
            }),
          ]),
        ])
      );

      data[150] = { ...data[150], id: 199 };
      page.update();
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3) {
          const key = Object.keys(event.diff)[0];
          const update = event.diff[key].update.table.properties;

          // @ts-expect-error type error
          const columns = update.columns as UI.Table.Column[];

          if (!columns || columns.length !== 2) {
            return false;
          }

          const first = columns[0];
          const second = columns[1];

          if (typeof first === "string" || typeof second === "string") {
            return false;
          }

          const firstCorrect = first.key === "0" && first.original === "id";
          const secondCorrect =
            second.key === "1" &&
            second.original === "beepboop" &&
            second.format === "string";

          // @ts-expect-error type error
          const dataRow = update.data[0];
          const rowCorrect =
            dataRow["0"] === 0 &&
            dataRow["1"] === "random" &&
            Object.keys(dataRow).length === 2;

          return firstCorrect && secondCorrect && rowCorrect;
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });
});
