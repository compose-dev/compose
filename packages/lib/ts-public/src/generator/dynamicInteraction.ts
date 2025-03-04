import * as UI from "../ui";
import { displayGenerator } from "./displayInteraction";
import { dynamicForEach } from "./layoutInteraction";

type OptionalDynamicCondProperties<
  TTrue extends UI.OutputOmittedComponents.All | undefined,
  TFalse extends UI.OutputOmittedComponents.All | undefined,
> = {
  true: TTrue;
  false: TFalse;
};

type Falsey = "" | 0 | false | undefined | null;

type IFExists<T> = T extends undefined
  ? UI.OutputOmittedComponents.DisplayNone
  : T extends UI.OutputOmittedComponents.All
    ? T
    : UI.OutputOmittedComponents.DisplayNone;

/**
 * Conditionally displays a component based on a condition. Conditions are evaluated for truthiness.
 *
 * @see {@link https://docs.composehq.com/components/dynamic/if-else Documentation}
 *
 * @param {any} condition - The condition to evaluate. If truthy, the `true` component will be displayed; otherwise, the `false` component will be displayed.
 * @param {Partial<OptionalDynamicCondProperties>} properties - Optional properties to configure the component.
 * @param {UI.OutputOmittedComponents.All} properties.true - The component to display if the condition is truthy. Will display nothing if not provided.
 * @param {UI.OutputOmittedComponents.All} properties.false - The component to display if the condition is falsey. Will display nothing if not provided.
 *
 * @returns The configured component.
 *
 * @example
 * ```ts
 * page.add(() => ui.cond(
 *   3 > 2,
 *   {
 *     true: ui.text("This is true"),
 *     false: ui.text("This is false"),
 *   }
 * ));
 * ```
 */
function dynamicCond<TCondition extends any, TProperties extends undefined>(
  condition: TCondition,
  properties?: TProperties
): UI.OutputOmittedComponents.DisplayNone;

/**
 * Conditionally displays a component based on a condition. Conditions are evaluated for truthiness.
 *
 * @see {@link https://docs.composehq.com/components/dynamic/if-else Documentation}
 *
 * @param {any} condition - The condition to evaluate. If truthy, the `true` component will be displayed; otherwise, the `false` component will be displayed.
 * @param {Partial<OptionalDynamicCondProperties>} properties - Optional properties to configure the component.
 * @param {UI.OutputOmittedComponents.All} properties.true - The component to display if the condition is truthy. Will display nothing if not provided.
 * @param {UI.OutputOmittedComponents.All} properties.false - The component to display if the condition is falsey. Will display nothing if not provided.
 *
 * @returns The configured component.
 *
 * @example
 * ```ts
 * page.add(() => ui.cond(
 *   3 > 2,
 *   {
 *     true: ui.text("This is true"),
 *     false: ui.text("This is false"),
 *   }
 * ));
 * ```
 */
function dynamicCond<
  TCondition extends true,
  TTrue extends UI.OutputOmittedComponents.All,
  TFalse extends UI.OutputOmittedComponents.All,
  TProperties extends Partial<OptionalDynamicCondProperties<TTrue, TFalse>>,
>(
  condition: TCondition,
  properties?: TProperties
): IFExists<TProperties["true"]>;

/**
 * Conditionally displays a component based on a condition. Conditions are evaluated for truthiness.
 *
 * @see {@link https://docs.composehq.com/components/dynamic/if-else Documentation}
 *
 * @param {any} condition - The condition to evaluate. If truthy, the `true` component will be displayed; otherwise, the `false` component will be displayed.
 * @param {Partial<OptionalDynamicCondProperties>} properties - Optional properties to configure the component.
 * @param {UI.OutputOmittedComponents.All} properties.true - The component to display if the condition is truthy. Will display nothing if not provided.
 * @param {UI.OutputOmittedComponents.All} properties.false - The component to display if the condition is falsey. Will display nothing if not provided.
 *
 * @returns The configured component.
 *
 * @example
 * ```ts
 * page.add(() => ui.cond(
 *   3 > 2,
 *   {
 *     true: ui.text("This is true"),
 *     false: ui.text("This is false"),
 *   }
 * ));
 * ```
 */
function dynamicCond<
  TCondition extends Falsey,
  TTrue extends UI.OutputOmittedComponents.All | undefined,
  TFalse extends UI.OutputOmittedComponents.All | undefined,
  TProperties extends Partial<OptionalDynamicCondProperties<TTrue, TFalse>>,
>(
  condition: TCondition,
  properties?: TProperties
): IFExists<TProperties["false"]>;

/**
 * Conditionally displays a component based on a condition. Conditions are evaluated for truthiness.
 *
 * @see {@link https://docs.composehq.com/components/dynamic/if-else Documentation}
 *
 * @param {any} condition - The condition to evaluate. If truthy, the `true` component will be displayed; otherwise, the `false` component will be displayed.
 * @param {Partial<OptionalDynamicCondProperties>} properties - Optional properties to configure the component.
 * @param {UI.OutputOmittedComponents.All} properties.true - The component to display if the condition is truthy. Will display nothing if not provided.
 * @param {UI.OutputOmittedComponents.All} properties.false - The component to display if the condition is falsey. Will display nothing if not provided.
 *
 * @returns The configured component.
 *
 * @example
 * ```ts
 * page.add(() => ui.cond(
 *   3 > 2,
 *   {
 *     true: ui.text("This is true"),
 *     false: ui.text("This is false"),
 *   }
 * ));
 * ```
 */
function dynamicCond<
  TCondition extends boolean,
  TTrue extends UI.OutputOmittedComponents.All | undefined,
  TFalse extends UI.OutputOmittedComponents.All | undefined,
  TProperties extends Partial<OptionalDynamicCondProperties<TTrue, TFalse>>,
>(
  condition: TCondition,
  properties?: TProperties
):
  | IFExists<TProperties["false"] & { maybeUndefined: true }>
  | IFExists<TProperties["true"] & { maybeUndefined: true }>
  | UI.OutputOmittedComponents.DisplayNone;

function dynamicCond<
  TCondition extends any,
  TTrue extends UI.OutputOmittedComponents.All,
  TFalse extends UI.OutputOmittedComponents.All,
>(
  condition: TCondition,
  properties: Partial<OptionalDynamicCondProperties<TTrue, TFalse>> = {}
): any {
  if (condition) {
    if (properties.true) {
      return properties.true;
    }

    return displayGenerator.none();
  } else {
    if (properties.false) {
      return properties.false;
    }

    return displayGenerator.none();
  }
}

const dynamicGenerator = {
  cond: dynamicCond,
  forEach: dynamicForEach,
};

export { dynamicGenerator };
