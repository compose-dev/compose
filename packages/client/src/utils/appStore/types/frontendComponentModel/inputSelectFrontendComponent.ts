import { UI } from "@composehq/ts-public";

type WithInputSelectInteraction = Extract<
  UI.ComponentGenerators.AllWithInputInteraction,
  {
    type: UI.InputComponentTypes.SelectTypeWithOptionsList;
  }
>;

/**
 * Modifies the `options` property on select components.
 * In the SDK, we allow multiple formats such as an array of strings.
 * The frontend only accepts an array of objects.
 */
type ModifyInputSelectInteraction<T extends WithInputSelectInteraction> = {
  [K in keyof T]: K extends "model"
    ? {
        [P in keyof T["model"]]: P extends "properties"
          ? {
              [Q in keyof T["model"]["properties"]]: Q extends "options"
                ? UI.SelectOption.AsDict[]
                : T["model"]["properties"][Q];
            }
          : T["model"][P];
      }
    : T[K];
};

type WithModifiedInputSelectInteraction =
  | ModifyInputSelectInteraction<UI.ComponentGenerators.InputRadioGroup>
  | ModifyInputSelectInteraction<UI.ComponentGenerators.InputSelectDropdown>
  | ModifyInputSelectInteraction<UI.ComponentGenerators.InputMultiSelectDropdown>;

export { type WithModifiedInputSelectInteraction };
