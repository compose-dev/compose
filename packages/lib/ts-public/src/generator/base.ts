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
  /**
   * Style the component directly using CSS. For complex components, this will
   * be applied to the root element of the component.
   */
  style: UI.Components.All["model"]["style"];
}

interface BaseWithDisplayInteraction extends Base {
  /**
   * Style the component directly using CSS. For complex components, this will
   * be applied to the root element of the component.
   */
  style: UI.Components.All["model"]["style"];
}

interface BaseWithLayoutInteraction<TChildren extends UI.BaseGeneric.Children>
  extends Base {
  /**
   * Style the component directly using CSS. For complex components, this will
   * be applied to the root element of the component.
   */
  style: UI.Components.All["model"]["style"];
  /**
   * The children to be arranged by the component. Can be a single component or
   * a list of components.
   */
  children: TChildren;
  /**
   * The direction to arrange the children. Options:
   * - `vertical`
   * - `vertical-reverse`
   * - `horizontal`
   * - `horizontal-reverse`
   */
  direction: UI.Components.AllWithLayoutInteraction["model"]["direction"];
  /**
   * Main-axis alignment of the child components. Options:
   * - `start`
   * - `end`
   * - `center`
   * - `between`
   * - `around`
   * - `evenly`
   */
  justify: UI.Components.AllWithLayoutInteraction["model"]["justify"];
  /**
   * Cross-axis alignment of the child components. Options:
   * - `start`
   * - `end`
   * - `center`
   * - `baseline`
   * - `stretch`
   */
  align: UI.Components.AllWithLayoutInteraction["model"]["align"];
  /**
   * Spacing between child components. Defaults to `16px`.
   */
  spacing: UI.Components.AllWithLayoutInteraction["model"]["spacing"];
  /**
   * Whether the component should automatically adjust to a vertical layout
   * on mobile devices. Defaults to `true`.
   */
  responsive: UI.Components.AllWithLayoutInteraction["model"]["responsive"];
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
