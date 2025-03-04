import { describe, expect, it } from "vitest";
import { mockRunner, ApiEventTracker } from "./appRunner.testUtils";
import { SdkToServerEvent, UI } from "@composehq/ts-public";
import { ComponentTree } from "../../utils";

describe("App Runner - Form Submit Button", () => {
  it("should add submit button to form if not present", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() => ui.form("form", [ui.textInput("input")]));
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RENDER_UI_V2) {
          const model = event.ui.model;

          if (
            model.id === "form" &&
            "children" in model &&
            Array.isArray(model.children) &&
            model.children.length === 2 &&
            model.children[1].type === UI.TYPE.BUTTON_FORM_SUBMIT
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

  it("should add submit button to form when only one child", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() => ui.form("form", ui.textInput("input")));
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RENDER_UI_V2) {
          const model = event.ui.model;

          if (
            model.id === "form" &&
            "children" in model &&
            Array.isArray(model.children) &&
            model.children.length === 2 &&
            model.children[1].type === UI.TYPE.BUTTON_FORM_SUBMIT
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

  it("should add submit button to form when nested", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.row(
          ui.stack([
            ui.text("hello"),
            ui.code("SHEESH"),
            ui.form(
              "form",
              ui.stack([ui.textInput("input"), ui.textInput("input")])
            ),
            ui.text("world"),
          ])
        )
      );
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RENDER_UI_V2) {
          const model = event.ui.model;

          const component = ComponentTree.findById(
            event.ui,
            "form"
          ) as UI.ComponentGenerators.LayoutForm | null;

          if (component === null) {
            return false;
          }

          const children = component.model.children;

          if (
            Array.isArray(children) &&
            children.length === 2 &&
            children[1].type === UI.TYPE.BUTTON_FORM_SUBMIT
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

  it("should not add submit button to form when already present", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.row(
          ui.stack([
            ui.text("hello"),
            ui.code("SHEESH"),
            ui.form(
              "form",
              ui.stack([
                ui.textInput("input"),
                ui.submitButton("yo button"),
                ui.textInput("input"),
              ])
            ),
            ui.text("world"),
          ])
        )
      );
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RENDER_UI_V2) {
          const count = ComponentTree.countByType(
            event.ui,
            UI.TYPE.BUTTON_FORM_SUBMIT
          );

          return count === 1;
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("should not add submit button to form when hide is true", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.row(
          ui.stack([
            ui.text("hello"),
            ui.code("SHEESH"),
            ui.form(
              "form",
              ui.stack([ui.textInput("input"), ui.textInput("input")]),
              {
                hideSubmitButton: true,
              }
            ),
            ui.text("world"),
          ])
        )
      );
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RENDER_UI_V2) {
          const count = ComponentTree.countByType(
            event.ui,
            UI.TYPE.BUTTON_FORM_SUBMIT
          );

          return count === 0;
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("should remove submit buttons from form when hide is true", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() =>
        ui.row(
          ui.stack([
            ui.text("hello"),
            ui.code("SHEESH"),
            ui.form(
              "form",
              [
                ui.stack([
                  ui.textInput("input"),
                  ui.submitButton("yo button"),
                  ui.textInput("input"),
                ]),
                ui.submitButton("yo1 button"),
                ui.stack(ui.submitButton("yo3 button")),
                ui.card(
                  ui.row(
                    ui.stack([ui.code("yeet"), ui.submitButton("annother one")])
                  )
                ),
              ],
              {
                hideSubmitButton: true,
              }
            ),
            ui.text("world"),
          ])
        )
      );
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RENDER_UI_V2) {
          const count = ComponentTree.countByType(
            event.ui,
            UI.TYPE.BUTTON_FORM_SUBMIT
          );

          return count === 0;
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
  });

  it("should not rerender auto added submit button when not necessary", async () => {
    const { appRunner, api } = mockRunner(async ({ page, ui }) => {
      page.add(() => ui.form("form", [ui.textInput("input")]));

      let text = "hello";
      page.add(() => ui.text(text));
      text = "world";
      page.update();
    });

    const tracker = new ApiEventTracker(api, {
      condition: (event) => {
        if (event.type === SdkToServerEvent.TYPE.RERENDER_UI_V3) {
          // Check that only the second page.add() render is updated
          // and not the one with the form.
          if (
            Object.keys(event.diff).length === 1 &&
            tracker.renders[1].renderId in event.diff
          ) {
            return true;
          }
        }
      },
    });

    await appRunner.execute({});
    await tracker.waitUntilCondition();

    expect(tracker.metCondition).toEqual(true);
    expect(tracker.rerenderCount).toEqual(1);
  });
});
