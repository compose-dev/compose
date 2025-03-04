import { describe, expect, it } from "vitest";
import { mockRunner, ApiEventTracker } from "./appRunner.testUtils";
import { SdkToServerEvent, UI } from "@composehq/ts-public";

describe("App Runner - Modal", () => {
  it("should render as a modal", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      let text = "original text";
      page.modal(() => ui.text(text));
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) =>
        event.type === SdkToServerEvent.TYPE.RENDER_UI_V2 &&
        event.appearance === UI.RENDER_APPEARANCE.MODAL,
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("normal add is not a modal", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      let text = "original text";
      page.add(() => ui.text(text));
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) =>
        event.type === SdkToServerEvent.TYPE.RENDER_UI_V2 &&
        event.appearance === UI.RENDER_APPEARANCE.DEFAULT,
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("should respect modal width and title parameters", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.modal(() => ui.text("yo"), { width: "xl", title: "YO MAMA" });
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) =>
        event.type === SdkToServerEvent.TYPE.RENDER_UI_V2 &&
        event.modalWidth === UI.MODAL_WIDTH.xl &&
        event.modalHeader === "YO MAMA",
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });
});
