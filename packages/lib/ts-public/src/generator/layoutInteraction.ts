import { v4 as uuid } from "uuid";
import * as UI from "../ui";
import { BaseWithLayoutInteraction } from "./base";

interface LayoutStackProperties<TChildren extends UI.BaseGeneric.Children>
  extends BaseWithLayoutInteraction<TChildren> {}

type RequiredLayoutStackFields = "children" | "id";
type OptionalLayoutStackProperties<TChildren extends UI.BaseGeneric.Children> =
  Omit<LayoutStackProperties<TChildren>, RequiredLayoutStackFields>;

const defaultLayoutStackProperties: OptionalLayoutStackProperties<UI.BaseGeneric.Children> =
  {
    direction: "vertical",
    justify: "start",
    align: "start",
    style: null,
    spacing: "16px",
  };

/**
 * A flexible container for arranging and styling its children. By default, it arranges its children in a vertical stack.
 *
 * @example
 * ```typescript
 * page.add(() => ui.stack(
 *   [
 *     ui.text("Hello"),
 *     ui.text("World"),
 *   ],
 *   { spacing: "32px" }
 * ));
 * ```
 *
 * @link Read the full {@link https://docs.composehq.com/components/layout/stack documentation}
 *
 * @param {TChildren} children - The children to be arranged by the stack.
 * @param {Partial<OptionalLayoutStackProperties<TChildren>>} properties - Optional properties to configure the stack.
 * @param {Partial<OptionalLayoutStackProperties<TChildren>>["direction"]} properties.direction - Direction to arrange the child components. Defaults to `"vertical"`.
 * @param {Partial<OptionalLayoutStackProperties<TChildren>>["justify"]} properties.justify - Main-axis alignment of the child components. Defaults to `"start"`.
 * @param {Partial<OptionalLayoutStackProperties<TChildren>>["align"]} properties.align - Cross-axis alignment of the child components. Defaults to `"start"`.
 * @param {Partial<OptionalLayoutStackProperties<TChildren>>["spacing"]} properties.spacing - Spacing between the child components. Defaults to `"16px"`.
 * @param {Partial<OptionalLayoutStackProperties<TChildren>>["style"]} properties.style - CSS styles object to directly style the container HTML element.
 * @returns The configured stack component.
 */
function layoutStack<TChildren extends UI.BaseGeneric.Children>(
  children: TChildren,
  properties: Partial<OptionalLayoutStackProperties<TChildren>> = {}
): UI.OutputOmittedComponents.LayoutStack<UI.BaseGeneric.Id, TChildren> {
  const id = uuid();

  const mergedProperties = {
    ...defaultLayoutStackProperties,
    ...properties,
  };

  return {
    model: {
      id,
      children,
      direction: mergedProperties.direction,
      justify: mergedProperties.justify,
      align: mergedProperties.align,
      style: mergedProperties.style,
      spacing: mergedProperties.spacing,
      properties: {},
    },
    hooks: null,
    type: UI.TYPE.LAYOUT_STACK,
    interactionType: UI.INTERACTION_TYPE.LAYOUT,
  };
}

/**
 * Map an array of items to a list of components.
 *
 * @example
 * ```typescript
 * page.add(() =>
 *  ui.forEach(["1", "2", "3"], (item) => ui.text(item))
 * );
 * ```
 *
 * @link Read the full {@link https://docs.composehq.com/components/dynamic/for-each documentation}.
 *
 * @param {TItem[]} items - The array of items to map to components.
 * @param {(item: TItem, index: number) => TChild} generator - A function that takes an item and its index and returns a component.
 * @param {Partial<OptionalLayoutStackProperties<TChild[]>>} properties - Optional properties to configure the container component.
 * @param {Partial<OptionalLayoutStackProperties<TChild[]>>["direction"]} properties.direction - Direction to arrange the child components. Defaults to `"vertical"`.
 * @param {Partial<OptionalLayoutStackProperties<TChild[]>>["justify"]} properties.justify - Main-axis alignment of the child components. Defaults to `"start"`.
 * @param {Partial<OptionalLayoutStackProperties<TChild[]>>["align"]} properties.align - Cross-axis alignment of the child components. Defaults to `"start"`.
 * @param {Partial<OptionalLayoutStackProperties<TChild[]>>["spacing"]} properties.spacing - Spacing between the child components. Defaults to `"16px"`.
 * @param {Partial<OptionalLayoutStackProperties<TChild[]>>["style"]} properties.style - CSS styles object to directly style the container HTML element.
 * @returns The configured container component with the mapped child components.
 */
function dynamicForEach<TItem, TChild extends UI.OutputOmittedComponents.All>(
  items: TItem[],
  generator: (item: TItem, index: number) => TChild,
  properties: Partial<OptionalLayoutStackProperties<TChild[]>> = {}
): UI.OutputOmittedComponents.LayoutStack<
  UI.BaseGeneric.Id,
  (TChild & { maybeUndefined: true })[]
> {
  return layoutGenerator.stack(
    items.map((item, index) => generator(item, index)),
    properties
  ) as UI.OutputOmittedComponents.LayoutStack<
    UI.BaseGeneric.Id,
    (TChild & { maybeUndefined: true })[]
  >;
}

/**
 * A flexible container for arranging and styling its children. By default, it
 * arranges its children in a horizontal row.
 *
 * @param children - The children to be arranged by the row.
 * @param properties - Optional properties to configure the row.
 * @returns The configured row component.
 */
function layoutRow<TChildren extends UI.BaseGeneric.Children>(
  children: TChildren,
  properties: Partial<
    Omit<OptionalLayoutStackProperties<TChildren>, "direction">
  > = {}
): UI.OutputOmittedComponents.LayoutStack<UI.BaseGeneric.Id, TChildren> {
  return layoutStack(children, { direction: "horizontal", ...properties });
}

/**
 * A flexible container for arranging and styling its children. By default, it
 * distributes its children in a row and maximizes the space between them.
 *
 * A common use case is for headers where you have text on the left and buttons
 * on the right.
 *
 * @param children - The children to be arranged by the row.
 * @param properties - Optional properties to configure the row.
 * @returns The configured distributed row component.
 */
function layoutDistributedRow<TChildren extends UI.BaseGeneric.Children>(
  children: TChildren,
  properties: Partial<
    Omit<OptionalLayoutStackProperties<TChildren>, "direction" | "justify">
  > = {}
): UI.OutputOmittedComponents.LayoutStack<UI.BaseGeneric.Id, TChildren> {
  return layoutStack(children, {
    direction: "horizontal",
    justify: "between",
    align: "center",
    ...properties,
  });
}

/**
 * A flexible container for arranging and styling its children. By default, it
 * renders its children inside a card UI.
 *
 * @param children - The children to be arranged by the row.
 * @param properties - Optional properties to configure the row.
 * @returns The configured card component.
 */
function layoutCard<TChildren extends UI.BaseGeneric.Children>(
  children: TChildren,
  properties: Partial<OptionalLayoutStackProperties<TChildren>> = {}
): UI.OutputOmittedComponents.LayoutStack<UI.BaseGeneric.Id, TChildren> {
  const stack = layoutStack(children, properties);

  return {
    ...stack,
    model: {
      ...stack.model,
      appearance: "card",
    },
  };
}

interface LayoutFormProperties<TChildren extends UI.BaseGeneric.Children>
  extends BaseWithLayoutInteraction<TChildren> {
  validate: UI.Factory.Nullable<
    UI.Factory.ValidatorCallback<UI.Factory.FormData<TChildren>>
  >;
  onSubmit: UI.Factory.Nullable<
    UI.Factory.InputValueCallback<UI.Factory.FormData<TChildren>>
  >;
  clearOnSubmit: UI.Components.LayoutForm["model"]["properties"]["clearOnSubmit"];
  hideSubmitButton: UI.Components.LayoutForm["model"]["properties"]["hideSubmitButton"];
}

type RequiredLayoutFormFields = "children" | "id";
type OptionalLayoutFormProperties<TChildren extends UI.BaseGeneric.Children> =
  Omit<LayoutFormProperties<TChildren>, RequiredLayoutFormFields>;

/**
 * Create a form component that groups child components into a single form.
 *
 * @example
 * ```ts
 * page.add(() => ui.form(
 *   "form-id",
 *   [
 *     ui.textInput("name"),
 *     ui.emailInput("email"),
 *   ],
 *   {
 *     onSubmit: (form) => {
 *       const { name, email } = form;
 *     }
 *   }
 * ));
 * ```
 *
 * @see Read the full {@link https://docs.composehq.com/components/layout/form documentation}
 *
 * @param {string} id - Unique id to identify the form.
 * @param {LayoutFormProperties["children"]} children - Child components that will be grouped into the form.
 * @param {Partial<OptionalLayoutFormProperties>} properties - Optional properties to configure the form.
 * @param {UI.Components.LayoutForm["model"]["align"]} properties.align - Cross-axis alignment of child components. Follows css flexbox `align-items`. Defaults to `"start"`.
 * @param {UI.Components.LayoutForm["model"]["properties"]["clearOnSubmit"]} properties.clearOnSubmit - Clear the form back to its initial state after submission. Defaults to `false`.
 * @param {UI.Components.LayoutForm["model"]["direction"]} properties.direction - Direction of child components. Follows css flexbox `flex-direction`. Defaults to `"vertical"`.
 * @param {UI.Components.LayoutForm["model"]["properties"]["hideSubmitButton"]} properties.hideSubmitButton - Hide the form submit button. Defaults to `false`.
 * @param {UI.Components.LayoutForm["model"]["justify"]} properties.justify - Main-axis alignment of child components. Follows css flexbox `justify-content`. Defaults to `"start"`.
 * @param {UI.Components.LayoutForm["hooks"]["onSubmit"]} properties.onSubmit - Function to be called when the form is submitted.
 * @param {UI.Components.LayoutForm["model"]["spacing"]} properties.spacing - Spacing between child components. Defaults to `16px`.
 * @param {UI.Components.LayoutForm["model"]["style"]} properties.style - CSS styles object to directly style the form HTML element.
 * @param {UI.Components.LayoutForm["hooks"]["validate"]} properties.validate - Custom validation function to validate the form inputs. Return nothing if valid, or a string error message if invalid.
 * @returns The configured form component.
 */
function layoutForm<
  TId extends UI.BaseGeneric.Id,
  TChildren extends UI.BaseGeneric.Children,
>(
  id: TId,
  children: TChildren,
  properties: Partial<OptionalLayoutFormProperties<TChildren>> = {}
): UI.OutputOmittedComponents.LayoutForm<TId, TChildren> {
  const modelProperties: UI.Components.LayoutForm["model"]["properties"] = {
    hasOnSubmitHook: !!properties.onSubmit,
    hasValidateHook: !!properties.validate,
    clearOnSubmit: properties.clearOnSubmit || false,
  };

  // Only need to add if true since default is false
  if (properties.hideSubmitButton) {
    modelProperties.hideSubmitButton = properties.hideSubmitButton;
  }

  return {
    model: {
      id,
      children,
      direction: properties.direction || "vertical",
      justify: properties.justify || "start",
      align: properties.align || "start",
      style: properties.style || null,
      spacing: properties.spacing || "16px",
      properties: modelProperties,
    },
    hooks: {
      validate: (properties.validate ||
        null) as UI.OutputOmittedComponents.LayoutForm<
        TId,
        TChildren
      >["hooks"]["validate"],
      onSubmit: (properties.onSubmit ||
        null) as UI.OutputOmittedComponents.LayoutForm<
        TId,
        TChildren
      >["hooks"]["onSubmit"],
    },
    type: UI.TYPE.LAYOUT_FORM,
    interactionType: UI.INTERACTION_TYPE.LAYOUT,
  };
}

const layoutGenerator = {
  stack: layoutStack,
  distributedRow: layoutDistributedRow,
  card: layoutCard,
  row: layoutRow,
  form: layoutForm,
};

export { layoutGenerator, dynamicForEach };
