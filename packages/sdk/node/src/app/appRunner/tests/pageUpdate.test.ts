import { describe, expect, it } from "vitest";
import { mockRunner, ApiEventTracker, waitUntil } from "./appRunner.testUtils";
import { SdkToServerEvent } from "@composehq/ts-public";

describe("App Runner - Page Update", () => {
  it("should update the page when text changes", async () => {
    let tracker: ApiEventTracker;

    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      let text = "original text";
      page.add(() => ui.text(text));

      await waitUntil(() => tracker && tracker.oneRenderOrMore, {
        onSuccess: () => {
          text = "updated text";
          page.update();
        },
      });
    });

    tracker = new ApiEventTracker(api, {
      condition: (event) =>
        event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3 &&
        JSON.stringify(event.diff).includes("updated text"),
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.oneRerenderOrMore).toEqual(true);
    expect(tracker.metCondition).toEqual(true);
  });

  it("should not update the page when text does not change", async () => {
    let tracker: ApiEventTracker;

    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      let text = "original text";
      page.add(() => ui.text(text));

      await waitUntil(() => tracker && tracker.oneRenderOrMore, {
        onSuccess: () => {
          text = "original text";
          page.update();
        },
      });
    });

    tracker = new ApiEventTracker(api, {
      condition: (event) => event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3,
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.oneRerenderOrMore).toEqual(false);
  });

  it("should update when table data changes", async () => {
    let tracker: ApiEventTracker;

    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      let data = [
        { id: "1", name: "John" },
        { id: "2", name: "Jane" },
      ];
      page.add(() => ui.table("table-id", data));

      await waitUntil(() => tracker && tracker.oneRenderOrMore, {
        onSuccess: () => {
          data[0] = {
            id: "1",
            name: "Updated John",
          };

          page.update();
        },
      });
    });

    tracker = new ApiEventTracker(api, {
      condition: (event) =>
        event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3 &&
        JSON.stringify(event.diff).includes("Updated John"),
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.oneRerenderOrMore).toEqual(true);
    expect(tracker.metCondition).toEqual(true);
  });

  it("should not update when table data does not change", async () => {
    let tracker: ApiEventTracker;

    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      let data = [
        { id: "1", name: "John" },
        { id: "2", name: "Jane" },
      ];
      page.add(() => ui.table("table-id", data));

      await waitUntil(() => tracker && tracker.oneRenderOrMore, {
        onSuccess: () => {
          data[0] = {
            id: "1",
            name: "John",
          };

          page.update();
        },
      });
    });

    tracker = new ApiEventTracker(api, {
      condition: (event) => event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3,
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(false);
  });

  it("should update when table row is added", async () => {
    let tracker: ApiEventTracker;

    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      let data = [
        { id: "1", name: "John" },
        { id: "2", name: "Jane" },
      ];
      page.add(() => ui.table("table-id", data));

      await waitUntil(() => tracker && tracker.oneRenderOrMore, {
        onSuccess: () => {
          data.push({ id: "3", name: "Jim" });
          page.update();
        },
      });
    });

    tracker = new ApiEventTracker(api, {
      condition: (event) =>
        event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3 &&
        JSON.stringify(event.diff).includes("Jim"),
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.oneRerenderOrMore).toEqual(true);
    expect(tracker.metCondition).toEqual(true);
  });

  it("should update when select option changes", async () => {
    let tracker: ApiEventTracker;

    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      let data = ["Option 1", "Option 2"];
      page.add(() => ui.selectBox("select-id", data));

      await waitUntil(() => tracker && tracker.oneRenderOrMore, {
        onSuccess: () => {
          data[0] = "Option 3";
          page.update();
        },
      });
    });

    tracker = new ApiEventTracker(api, {
      condition: (event) =>
        event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3 &&
        JSON.stringify(event.diff).includes("Option 3"),
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.oneRerenderOrMore).toEqual(true);
    expect(tracker.metCondition).toEqual(true);
  });

  it("should update when multiselect option changes", async () => {
    let tracker: ApiEventTracker;

    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      let data = ["Option 1", "Option 2"];
      page.add(() => ui.multiSelectBox("select-id", data));

      await waitUntil(() => tracker && tracker.oneRenderOrMore, {
        onSuccess: () => {
          data[0] = "Option 3";
          page.update();
        },
      });
    });

    tracker = new ApiEventTracker(api, {
      condition: (event) =>
        event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3 &&
        JSON.stringify(event.diff).includes("Option 3"),
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.oneRerenderOrMore).toEqual(true);
    expect(tracker.metCondition).toEqual(true);
  });

  it("should update when radio option changes", async () => {
    let tracker: ApiEventTracker;

    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      let data = ["Option 1", "Option 2"];
      page.add(() => ui.radioGroup("radio-id", data));

      await waitUntil(() => tracker && tracker.oneRenderOrMore, {
        onSuccess: () => {
          data[0] = "Option 3";
          page.update();
        },
      });
    });

    tracker = new ApiEventTracker(api, {
      condition: (event) =>
        event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3 &&
        JSON.stringify(event.diff).includes("Option 3"),
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.oneRerenderOrMore).toEqual(true);
    expect(tracker.metCondition).toEqual(true);
  });
});
