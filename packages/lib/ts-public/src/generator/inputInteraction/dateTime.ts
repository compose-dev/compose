import * as UI from "../../ui";
import * as dateUtils from "../../dateUtils";
import { BaseWithInputInteraction } from "../base";

interface DateTimeProperties<TRequired extends UI.BaseGeneric.Required>
  extends BaseWithInputInteraction<TRequired> {
  /**
   * A custom function to validate the datetime input. It should either return an error
   * string or void (i.e. nothing) if the input is valid.
   *
   * It will be passed an object with the following properties:
   * ```typescript
   * {
   *  year: number;
   *  month: number; // 1-12
   *  day: number; // 1-31
   *  hour: number; // 0-23
   *  minute: number; // 0-59
   *  jsDate: Date; // UTC midnight of the selected date
   * }
   * ```
   *
   * The callback may pass `null` if no datetime is selected and the component
   * has property `required: false`.
   */
  validate: UI.Factory.Nullable<
    UI.Factory.NullableValidatorCallback<UI.BaseInputValue.DateTime, TRequired>
  >;
  /**
   * A callback function that is called when the user presses enter while
   * the datetime input is focus. It will be passed an object with the following
   * properties:
   * ```typescript
   * {
   *  year: number;
   *  month: number; // 1-12
   *  day: number; // 1-31
   *  hour: number; // 0-23
   *  minute: number; // 0-59
   *  jsDate: Date; // UTC midnight of the selected date
   * }
   * ```
   *
   * The callback may pass `null` if no datetime is selected and the component
   * has property `required: false`.
   */
  onEnter: UI.Factory.Nullable<
    UI.Factory.NullableInputValueCallback<UI.BaseInputValue.DateTime, TRequired>
  >;
  /**
   * One of the following:
   * - A JS Date object in UTC
   * - Human readable object with year, month (1-12), day (1-31), hour (0-23), and minute (0-59)
   */
  initialValue: dateUtils.DateTimeInput | null;
  /**
   * One of the following:
   * - A JS Date object in UTC
   * - Human readable object with year, month (1-12), day (1-31), hour (0-23), and minute (0-59)
   */
  min: dateUtils.DateTimeInput | null;
  /**
   * One of the following:
   * - A JS Date object in UTC
   * - Human readable object with year, month (1-12), day (1-31), hour (0-23), and minute (0-59)
   */
  max: dateUtils.DateTimeInput | null;
}

type RequiredDateTimeFields = "id";
type OptionalDateTimeProperties<TRequired extends UI.BaseGeneric.Required> =
  Omit<DateTimeProperties<TRequired>, RequiredDateTimeFields>;

const defaultDateTimeProperties: OptionalDateTimeProperties<UI.BaseGeneric.Required> =
  {
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
 * Generate a datetime input component. For example:
 *
 * ```typescript
 * page.add(() =>
 *  ui.dateTimeInput("datetime", {
 *    onEnter: (datetime) => {
 *      const humanReadable = `${datetime.month}/${datetime.day}/${datetime.year} ${datetime.hour}:${datetime.minute}`;
 *      const js = datetime.jsDate;
 *    },
 *  })
 * );
 * ```
 * Or as part of a form:
 *
 * ```typescript
 * page.add(() =>
 *  ui.form("form", [ui.textInput("name"), ui.dateTimeInput("datetime")], {
 *    onSubmit: (formData) => {
 *      const { name, datetime } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/datetime-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalDateTimeProperties<TRequired>>} properties - Optional properties to configure the datetime input component.
 * @param {OptionalDateTimeProperties<TRequired>["label"]} properties.label - Label to display above the datetime input.
 * @param {OptionalDateTimeProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalDateTimeProperties<TRequired>["required"]} properties.required - Whether the datetime input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalDateTimeProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input.
 * @param {OptionalDateTimeProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the datetime input is focused.
 * @param {OptionalDateTimeProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the datetime input. Defaults to `null`.
 * @param {OptionalDateTimeProperties<TRequired>["min"]} properties.min - The minimum datetime that can be selected. Defaults to no minimum.
 * @param {OptionalDateTimeProperties<TRequired>["max"]} properties.max - The maximum datetime that can be selected. Defaults to no maximum.
 * @param {OptionalDateTimeProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the datetime input HTML element.
 * @returns The configured datetime input component.
 */
function dateTime<TId extends UI.BaseGeneric.Id, TRequired extends true>(
  id: TId,
  properties?: Partial<OptionalDateTimeProperties<TRequired>>
): UI.OutputOmittedComponents.InputDateTime<TId, TRequired>;

/**
 * Generate a datetime input component. For example:
 *
 * ```typescript
 * page.add(() =>
 *  ui.dateTimeInput("datetime", {
 *    onEnter: (datetime) => {
 *      const humanReadable = `${datetime.month}/${datetime.day}/${datetime.year} ${datetime.hour}:${datetime.minute}`;
 *      const js = datetime.jsDate;
 *    },
 *  })
 * );
 * ```
 * Or as part of a form:
 *
 * ```typescript
 * page.add(() =>
 *  ui.form("form", [ui.textInput("name"), ui.dateTimeInput("datetime")], {
 *    onSubmit: (formData) => {
 *      const { name, datetime } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/datetime-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalDateTimeProperties<TRequired>>} properties - Optional properties to configure the datetime input component.
 * @param {OptionalDateTimeProperties<TRequired>["label"]} properties.label - Label to display above the datetime input.
 * @param {OptionalDateTimeProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalDateTimeProperties<TRequired>["required"]} properties.required - Whether the datetime input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalDateTimeProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input.
 * @param {OptionalDateTimeProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the datetime input is focused.
 * @param {OptionalDateTimeProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the datetime input. Defaults to `null`.
 * @param {OptionalDateTimeProperties<TRequired>["min"]} properties.min - The minimum datetime that can be selected. Defaults to no minimum.
 * @param {OptionalDateTimeProperties<TRequired>["max"]} properties.max - The maximum datetime that can be selected. Defaults to no maximum.
 * @param {OptionalDateTimeProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the datetime input HTML element.
 * @returns The configured datetime input component.
 */
function dateTime<TId extends UI.BaseGeneric.Id, TRequired extends false>(
  id: TId,
  properties?: Partial<OptionalDateTimeProperties<TRequired>>
): UI.OutputOmittedComponents.InputDateTime<TId, TRequired>;

function dateTime<
  TId extends UI.BaseGeneric.Id,
  TRequired extends UI.BaseGeneric.Required,
>(
  id: TId,
  properties: Partial<OptionalDateTimeProperties<TRequired>> = {}
): UI.OutputOmittedComponents.InputDateTime<TId, TRequired> {
  const mergedProperties = {
    ...defaultDateTimeProperties,
    ...properties,
  };

  const initialValue = mergedProperties.initialValue
    ? dateUtils.getDateTimeModel(mergedProperties.initialValue)
    : null;
  const min = mergedProperties.min
    ? dateUtils.getDateTimeModel(mergedProperties.min)
    : null;
  const max = mergedProperties.max
    ? dateUtils.getDateTimeModel(mergedProperties.max)
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
        mergedProperties.validate as UI.OutputOmittedComponents.InputDateTime<
          TId,
          TRequired
        >["hooks"]["validate"],
      onEnter:
        mergedProperties.onEnter as UI.OutputOmittedComponents.InputDateTime<
          TId,
          TRequired
        >["hooks"]["onEnter"],
    },
    type: UI.TYPE.INPUT_DATE_TIME,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

export default dateTime;
