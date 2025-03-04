import { describe, it, expect } from "vitest";
import { SdkToServerEvent } from "@composehq/ts-public";

import { ApiEventTracker, mockRunner } from "./appRunner.testUtils";

describe("Confirm Dialog", () => {
  it("should set a confirmation dialog", async () => {
    const { appRunner } = mockRunner(({ page }) => {
      page.confirm();
    });

    await appRunner.execute({});

    expect(appRunner.confirmationDialog).not.toEqual(null);
    expect(appRunner.confirmationDialog?.isActive).toEqual(true);
  });

  it("should properly resolve a confirmation dialog", async () => {
    let result: boolean | null = null;

    const { appRunner } = mockRunner(async ({ page }) => {
      const x = page.confirm();
      appRunner.onConfirmResponseHook(appRunner.confirmationDialog!.id, true);
      result = await x;
    });

    await appRunner.execute({});

    expect(result).toEqual(true);
  });

  it("should not allow two confirmation dialogs simultaneously", async () => {
    const { appRunner, api } = mockRunner(async ({ page }) => {
      page.confirm();
      page.confirm();
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) =>
        event.type === SdkToServerEvent.TYPE.APP_ERROR_V2 &&
        event.errorMessage ===
          "Trying to open a confirmation dialog while another one is already open",
    });

    await appRunner.execute({});

    expect(tracker.metCondition).toEqual(true);
  });
});
