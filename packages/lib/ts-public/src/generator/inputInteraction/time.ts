import * as UI from "../../ui";
import * as dateUtils from "../../dateUtils";
import { BaseWithInputInteraction } from "../base";

interface TimeProperties<TRequired extends UI.BaseGeneric.Required>
  extends BaseWithInputInteraction<TRequired> {
  /**
   * A custom function to validate the time input. It should either return an error
   * string or void (i.e. nothing) if the input is valid.
   *
   * It will be passed an object with the following properties:
   * ```typescript
   * {
   *  hour: number; // 0-23
   *  minute: number; // 0-59
   * }
   * ```
   *
   * The callback may pass `null` if no time is selected and the component
   * has property `required: false`.
   */
  validate: UI.Factory.Nullable<
    UI.Factory.NullableValidatorCallback<UI.BaseInputValue.Time, TRequired>
  >;
  /**
   * A callback function that is called when the user presses enter while
   * the time input is focus. It will be passed an object with the following
   * properties:
   * ```typescript
   * {
   *  hour: number; // 0-23
   *  minute: number; // 0-59
   * }
   * ```
   *
   * The callback may pass `null` if no time is selected and the component
   * has property `required: false`.
   */
  onEnter: UI.Factory.Nullable<
    UI.Factory.NullableInputValueCallback<UI.BaseInputValue.Time, TRequired>
  >;
  /**
   * One of the following:
   * - A JS Date object in UTC
   * - Human readable object with hour (0-23) and minute (0-59)
   */
  initialValue: dateUtils.TimeInput | null;
  /**
   * One of the following:
   * - A JS Date object in UTC
   * - Human readable object with hour (0-23) and minute (0-59)
   */
  min: dateUtils.TimeInput | null;
  /**
   * One of the following:
   * - A JS Date object in UTC
   * - Human readable object with hour (0-23) and minute (0-59)
   */
  max: dateUtils.TimeInput | null;
}

type RequiredTimeFields = "id";
type OptionalTimeProperties<TRequired extends UI.BaseGeneric.Required> = Omit<
  TimeProperties<TRequired>,
  RequiredTimeFields
>;

const defaultTimeProperties: OptionalTimeProperties<UI.BaseGeneric.Required> = {
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
 * Generate a time input component. For example:
 *
 * ```typescript
 * page.add(() =>
 *  ui.timeInput("time", {
 *    onEnter: (time) => {
 *      const humanReadable = `${time.hour}:${time.minute}`;
 *    },
 *  })
 * );
 * ```
 * Or as part of a form:
 *
 * ```typescript
 * page.add(() =>
 *  ui.form("form", [ui.dateInput("date"), ui.timeInput("time")], {
 *    onSubmit: (formData) => {
 *      const { date, time } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/time-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalTimeProperties<TRequired>>} properties - Optional properties to configure the time input component.
 * @param {OptionalTimeProperties<TRequired>["label"]} properties.label - Label to display above the time input.
 * @param {OptionalTimeProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalTimeProperties<TRequired>["required"]} properties.required - Whether the time input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalTimeProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input.
 * @param {OptionalTimeProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the time input is focus.
 * @param {OptionalTimeProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the time input. Defaults to `null`.
 * @param {OptionalTimeProperties<TRequired>["min"]} properties.min - The minimum time that can be selected. Defaults to no minimum.
 * @param {OptionalTimeProperties<TRequired>["max"]} properties.max - The maximum time that can be selected. Defaults to no maximum.
 * @param {OptionalTimeProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the time input HTML element.
 * @returns The configured time input component.
 */
function time<TId extends UI.BaseGeneric.Id, TRequired extends true>(
  id: TId,
  properties?: Partial<OptionalTimeProperties<TRequired>>
): UI.OutputOmittedComponents.InputTime<TId, TRequired>;

/**
 * Generate a time input component. For example:
 *
 * ```typescript
 * page.add(() =>
 *  ui.timeInput("time", {
 *    onEnter: (time) => {
 *      const humanReadable = `${time.hour}:${time.minute}`;
 *    },
 *  })
 * );
 * ```
 * Or as part of a form:
 *
 * ```typescript
 * page.add(() =>
 *  ui.form("form", [ui.dateInput("date"), ui.timeInput("time")], {
 *    onSubmit: (formData) => {
 *      const { date, time } = formData;
 *    },
 *  })
 * );
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/time-input documentation}.
 *
 * @param {string} id - Unique id to identify the component.
 * @param {Partial<OptionalTimeProperties<TRequired>>} properties - Optional properties to configure the time input component.
 * @param {OptionalTimeProperties<TRequired>["label"]} properties.label - Label to display above the time input.
 * @param {OptionalTimeProperties<TRequired>["description"]} properties.description - Description to display below the label.
 * @param {OptionalTimeProperties<TRequired>["required"]} properties.required - Whether the time input is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalTimeProperties<TRequired>["validate"]} properties.validate - Custom function to validate the user's input.
 * @param {OptionalTimeProperties<TRequired>["onEnter"]} properties.onEnter - Callback function that is called when the user presses enter while the time input is focus.
 * @param {OptionalTimeProperties<TRequired>["initialValue"]} properties.initialValue - The initial value of the time input. Defaults to `null`.
 * @param {OptionalTimeProperties<TRequired>["min"]} properties.min - The minimum time that can be selected. Defaults to no minimum.
 * @param {OptionalTimeProperties<TRequired>["max"]} properties.max - The maximum time that can be selected. Defaults to no maximum.
 * @param {OptionalTimeProperties<TRequired>["style"]} properties.style - CSS styles object to directly style the time input HTML element.
 * @returns The configured time input component.
 */
function time<TId extends UI.BaseGeneric.Id, TRequired extends false>(
  id: TId,
  properties?: Partial<OptionalTimeProperties<TRequired>>
): UI.OutputOmittedComponents.InputTime<TId, TRequired>;

function time<
  TId extends UI.BaseGeneric.Id,
  TRequired extends UI.BaseGeneric.Required,
>(
  id: TId,
  properties: Partial<OptionalTimeProperties<TRequired>> = {}
): UI.OutputOmittedComponents.InputTime<TId, TRequired> {
  const mergedProperties = {
    ...defaultTimeProperties,
    ...properties,
  };

  const initialValue = mergedProperties.initialValue
    ? dateUtils.getTimeModel(mergedProperties.initialValue)
    : null;
  const min = mergedProperties.min
    ? dateUtils.getTimeModel(mergedProperties.min)
    : null;
  const max = mergedProperties.max
    ? dateUtils.getTimeModel(mergedProperties.max)
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
        mergedProperties.validate as UI.OutputOmittedComponents.InputTime<
          TId,
          TRequired
        >["hooks"]["validate"],
      onEnter: mergedProperties.onEnter as UI.OutputOmittedComponents.InputTime<
        TId,
        TRequired
      >["hooks"]["onEnter"],
    },
    type: UI.TYPE.INPUT_TIME,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

export default time;
