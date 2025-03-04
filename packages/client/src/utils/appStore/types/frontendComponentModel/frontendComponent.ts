import { UI } from "@composehq/ts-public";
import { WithModifiedInputSelectInteraction } from "./inputSelectFrontendComponent";

type WithInputInteractionExcludingSelects = Exclude<
  UI.ComponentGenerators.AllWithInputInteraction,
  {
    type: UI.InputComponentTypes.SelectTypeWithOptionsList;
  }
>;

export type WithInputInteraction = (
  | WithInputInteractionExcludingSelects
  | WithModifiedInputSelectInteraction
) & {
  formId: string | null;
};

export type WithDisplayInteraction =
  UI.ComponentGenerators.AllWithDisplayInteraction & {
    formId: string | null;
  };

export type WithButtonInteraction =
  UI.ComponentGenerators.AllWithButtonInteraction & {
    formId: string | null;
  };

export type WithLayoutInteraction =
  UI.ComponentGenerators.AllWithLayoutInteraction & {
    formId: string | null;
  };

/**
 * Page interactions are not rendered in the component tree. They are special
 * components that are rendered at the page level.
 */
export type PageConfirmInteraction = UI.HooksOmittedComponents.PageConfirm;

export type All =
  | WithInputInteraction
  | WithDisplayInteraction
  | WithButtonInteraction
  | WithLayoutInteraction;
