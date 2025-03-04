import * as UI from "../../ui";
import * as dateUtils from "../../dateUtils";
import { BaseWithInputInteraction } from "../base";

interface DateProperties<TRequired extends UI.BaseGeneric.Required>
  extends BaseWithInputInteraction<TRequired> {
  /**
   * A custom function to validate the date input. It should either return an error
   * string or void (i.e. nothing) if the input is valid.
   *
   * It will be passed an object with the following properties:
   * ```typescript
   * {
   *  year: number;
   *  month: number; // 1-12
   *  day: number; // 1-31
   *  jsDate: Date; // UTC midnight of the selected date
   * }
   * ```
   *
   * The callback may pass `null` if no date is selected and the component
   * has property `required: false`.
   */
  validate: UI.Factory.Nullable<
    UI.Factory.NullableValidatorCallback<UI.BaseInputValue.Date, TRequired>
  >;
  /**
   * A callback function that is called when the user presses enter while
   * the date input is focus. It will be passed an object with the following
   * properties:
   * ```typescript
   * {
   *  year: number;
   *  month: number; // 1-12
   *  day: number; // 1-31
   *  jsDate: Date; // UTC midnight of the selected date
   * }
   * ```
   *
   * The callback may pass `null` if no date is selected and the component
   * has property `required: false`.
   */
  onEnter: UI.Factory.Nullable<
    UI.Factory.NullableInputValueCallback<UI.BaseInputValue.Date, TRequired>
  >;
  /**
   * One of the following:
   * - A JS Date object in UTC
   * - Human readable object with year, month (1-12), and day (1-31)
   */
  initialValue: dateUtils.DateInput | null;
  /**
   * One of the following:
   * - A JS Date object in UTC
   * - Human readable object with year, month (1-12), and day (1-31)
   */
  min: dateUtils.DateInput | null;
  /**
   * One of the following:
   * - A JS Date object in UTC
   * - Human readable object with year, month (1-12), and day (1-31)
   */
  max: dateUtils.DateInput | null;
}

type RequiredDateFields = "id";
type OptionalDateProperties<TRequired extends UI.BaseGeneric.Required> = Omit<
  DateProperties<TRequired>,
  RequiredDateFields
>;

const defaultDateProperties: OptionalDateProperties<true> = {
  label: null,
  required: true,
  description: null,
  validate: null,
  onEnter: null,
  style: null,
  initialValue: null,
  min: null,
  max: null,
};

/**
 * Generate a date input component. For example:
 *
 * ```typescript
 * page.add(() =>
 *  ui.dateInput("date", {
 *    onEnter: (date) => {
 *      const humanReadable = `${date.month}/${date.day}/${date.year}`;
 *      const js = date.jsDate;
 *    },
 *  })
 * );
 * ```
 * Or as part of a form:
 *
 * ```typescript
 * page.add(() =>
 *  ui.form("form", [ui.textInput("name"), ui.dateInput("date")], {
 *    onSubmit: (formData) => {
 *      const { name, date } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/date-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalDateProperties<TRequired>>} properties - Optional properties to configure the date input component.
 * @param {OptionalDateProperties<TRequired>["label"]} properties.label - Label to display above the date input.
 * @param {OptionalDateProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalDateProperties<TRequired>["required"]} properties.required - Whether the date input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalDateProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input.
 * @param {OptionalDateProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the date input is focused.
 * @param {OptionalDateProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the date input. Defaults to `null`.
 * @param {OptionalDateProperties<TRequired>["min"]} properties.min - The minimum date that can be selected. Defaults to no minimum.
 * @param {OptionalDateProperties<TRequired>["max"]} properties.max - The maximum date that can be selected. Defaults to no maximum.
 * @param {OptionalDateProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the date input HTML element.
 * @returns The configured date input component.
 */
function date<TId extends UI.BaseGeneric.Id, TRequired extends true>(
  id: TId,
  properties?: Partial<OptionalDateProperties<TRequired>>
): UI.OutputOmittedComponents.InputDate<TId, TRequired>;

/**
 * Generate a date input component. For example:
 *
 * ```typescript
 * page.add(() =>
 *  ui.dateInput("date", {
 *    onEnter: (date) => {
 *      const humanReadable = `${date.month}/${date.day}/${date.year}`;
 *      const js = date.jsDate;
 *    },
 *  })
 * );
 * ```
 * Or as part of a form:
 *
 * ```typescript
 * page.add(() =>
 *  ui.form("form", [ui.textInput("name"), ui.dateInput("date")], {
 *    onSubmit: (formData) => {
 *      const { name, date } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/date-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalDateProperties<TRequired>>} properties - Optional properties to configure the date input component.
 * @param {OptionalDateProperties<TRequired>["label"]} properties.label - Label to display above the date input.
 * @param {OptionalDateProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalDateProperties<TRequired>["required"]} properties.required - Whether the date input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalDateProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input.
 * @param {OptionalDateProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the date input is focused.
 * @param {OptionalDateProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the date input. Defaults to `null`.
 * @param {OptionalDateProperties<TRequired>["min"]} properties.min - The minimum date that can be selected. Defaults to no minimum.
 * @param {OptionalDateProperties<TRequired>["max"]} properties.max - The maximum date that can be selected. Defaults to no maximum.
 * @param {OptionalDateProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the date input HTML element.
 * @returns The configured date input component.
 */
function date<TId extends UI.BaseGeneric.Id, TRequired extends false>(
  id: TId,
  properties?: Partial<OptionalDateProperties<TRequired>>
): UI.OutputOmittedComponents.InputDate<TId, TRequired>;

function date<
  TId extends UI.BaseGeneric.Id,
  TRequired extends UI.BaseGeneric.Required,
>(
  id: TId,
  properties: Partial<OptionalDateProperties<TRequired>> = {}
): UI.OutputOmittedComponents.InputDate<TId, TRequired> {
  const mergedProperties = {
    ...defaultDateProperties,
    ...properties,
  };

  const initialValue = mergedProperties.initialValue
    ? dateUtils.getDateModel(mergedProperties.initialValue)
    : null;
  const min = mergedProperties.min
    ? dateUtils.getDateModel(mergedProperties.min)
    : null;
  const max = mergedProperties.max
    ? dateUtils.getDateModel(mergedProperties.max)
    : null;

  return {
    model: {
      id,
      label: mergedProperties.label,
      description: mergedProperties.description,
      required: mergedProperties.required as TRequired,
      hasValidateHook: mergedProperties.validate !== null,
      properties: {
        initialValue,
        min,
        max,
        hasOnEnterHook: mergedProperties.onEnter !== null,
      },
      style: mergedProperties.style,
    },
    hooks: {
      validate:
        mergedProperties.validate as UI.OutputOmittedComponents.InputDate<
          TId,
          TRequired
        >["hooks"]["validate"],
      onEnter: mergedProperties.onEnter as UI.OutputOmittedComponents.InputDate<
        TId,
        TRequired
      >["hooks"]["onEnter"],
    },
    type: UI.TYPE.INPUT_DATE,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

export default date;
