import * as UI from "../ui";

interface Base {
  id: UI.Components.All["model"]["id"];
}

interface BaseWithInputInteraction<
  TRequired extends UI.BaseGeneric.Required = UI.BaseGeneric.Required,
> extends Base {
  /**
   * Style the component directly using CSS. For example:
   *
   * ```typescript
   * style: {
   *  backgroundColor: "red",
   *  borderRadius: "10px",
   *  padding: "10px",
   * }
   * ```
   */
  style: UI.Components.All["model"]["style"];
  /**
   * A label to display above the input.
   */
  label: UI.Components.AllWithInputInteraction["model"]["label"];
  /**
   * Whether the input is required. Defaults to `true`.
   */
  required: TRequired;
  /**
   * An optional description to display below the label.
   */
  description: UI.Components.AllWithInputInteraction["model"]["description"];
  /**
   * Pass a custom validation function to validate the input. Will be
   * used to validate the input prior to calling the input's main callback
   * (e.g. `onEnter` or `onChange`). If the input is part of a form, the
   * validator will be called to validate the form submission.
   */
  validate: UI.Factory.Nullable<Function>;
}

interface BaseWithButtonInteraction extends Base {
  style: UI.Components.All["model"]["style"];
}

interface BaseWithDisplayInteraction extends Base {
  style: UI.Components.All["model"]["style"];
}

interface BaseWithLayoutInteraction<TChildren extends UI.BaseGeneric.Children>
  extends Base {
  style: UI.Components.All["model"]["style"];
  children: TChildren;
  direction: UI.Components.AllWithLayoutInteraction["model"]["direction"];
  justify: UI.Components.AllWithLayoutInteraction["model"]["justify"];
  align: UI.Components.AllWithLayoutInteraction["model"]["align"];
  spacing: UI.Components.AllWithLayoutInteraction["model"]["spacing"];
}

interface BaseWithPageInteraction extends Base {}

const MULTI_SELECTION_MIN_DEFAULT = 0;
const MULTI_SELECTION_MAX_DEFAULT = 1000000000;

export {
  BaseWithInputInteraction,
  BaseWithButtonInteraction,
  BaseWithDisplayInteraction,
  BaseWithLayoutInteraction,
  BaseWithPageInteraction,
  MULTI_SELECTION_MIN_DEFAULT,
  MULTI_SELECTION_MAX_DEFAULT,
};
