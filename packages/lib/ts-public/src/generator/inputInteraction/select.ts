import * as UI from "../../ui";
import {
  BaseWithInputInteraction,
  MULTI_SELECTION_MIN_DEFAULT,
  MULTI_SELECTION_MAX_DEFAULT,
} from "../base";

interface BaseSelectProperties<
  TRequired extends UI.BaseGeneric.Required,
  TOptions extends UI.SelectOption.List,
> extends BaseWithInputInteraction<TRequired> {
  options: TOptions;
  /**
   * A custom function to validate the selected option. It will be passed the current selected option
   * and should return an error string or void (i.e. nothing) if the selection is valid.
   *
   * If the component is marked as `required: false`, the callback will be passed `null`
   * if there's no selection.
   */
  validate: UI.Factory.Nullable<
    UI.Factory.NullableValidatorCallback<
      UI.SelectOption.ExtractOptionValue<TOptions[number]>,
      TRequired
    >
  >;
  /**
   * A callback function that is called when the user selects an option. It will be passed
   * the current selected option.
   *
   * If the component is marked as `required: false`, the callback will be passed `null`
   * if there's no selection.
   */
  onChange: UI.Factory.Nullable<
    UI.Factory.NullableInputValueCallback<
      UI.SelectOption.ExtractOptionValue<TOptions[number]>,
      TRequired
    >
  >;
  /**
   * The initial value of the input.
   */
  initialValue: UI.Factory.Nullable<
    UI.SelectOption.ExtractOptionValue<TOptions[number]>
  >;
}

interface BaseMultiSelectProperties<
  TRequired extends UI.BaseGeneric.Required,
  TOptions extends UI.SelectOption.List,
> extends BaseWithInputInteraction<TRequired> {
  options: TOptions;
  /**
   * A custom function to validate the selected options. It will be passed the current selected options
   * and should return an error string or void (i.e. nothing) if the selections are valid.
   *
   * If the component is marked as `required: false`, the callback will be passed `null`
   * if there are no selections.
   */
  validate: UI.Factory.Nullable<
    UI.Factory.ValidatorCallback<
      UI.SelectOption.ExtractOptionValue<TOptions[number]>[]
    >
  >;
  /**
   * A callback function that is called when the user selects options. It will be passed
   * the current selected options.
   *
   * If the component is marked as `required: false`, the callback will be passed `null`
   * if there are no selections.
   */
  onChange: UI.Factory.Nullable<
    UI.Factory.InputValueCallback<
      UI.SelectOption.ExtractOptionValue<TOptions[number]>[]
    >
  >;
  /**
   * The initial value of the input.
   */
  initialValue: UI.SelectOption.ExtractOptionValue<TOptions[number]>[];
  /**
   * The minimum number of selections allowed. Defaults to 0.
   */
  minSelections: number;
  /**
   * The maximum number of selections allowed. Defaults to 1000000000.
   */
  maxSelections: number;
}

type BaseRequiredFields = "id" | "options";

interface RadioGroupProperties<
  TRequired extends UI.BaseGeneric.Required,
  TOptions extends UI.SelectOption.List,
> extends BaseSelectProperties<TRequired, TOptions> {}

interface SelectDropdownSingleProperties<
  TRequired extends UI.BaseGeneric.Required,
  TOptions extends UI.SelectOption.List,
> extends BaseSelectProperties<TRequired, TOptions> {}

interface SelectDropdownMultiProperties<
  TRequired extends UI.BaseGeneric.Required,
  TOptions extends UI.SelectOption.List,
> extends BaseMultiSelectProperties<TRequired, TOptions> {}

type OptionalRadioGroupProperties<
  TRequired extends UI.BaseGeneric.Required,
  TOptions extends UI.SelectOption.List,
> = Omit<RadioGroupProperties<TRequired, TOptions>, BaseRequiredFields>;

type OptionalSelectDropdownSingleProperties<
  TRequired extends UI.BaseGeneric.Required,
  TOptions extends UI.SelectOption.List,
> = Omit<
  SelectDropdownSingleProperties<TRequired, TOptions>,
  BaseRequiredFields
>;

type OptionalSelectDropdownMultiProperties<
  TRequired extends UI.BaseGeneric.Required,
  TOptions extends UI.SelectOption.List,
> = Omit<
  SelectDropdownMultiProperties<TRequired, TOptions>,
  BaseRequiredFields
>;

const defaultSelectProperties: OptionalRadioGroupProperties<
  UI.BaseGeneric.Required,
  UI.SelectOption.List
> = {
  label: null,
  required: true,
  description: null,
  validate: null,
  style: null,
  onChange: null,
  initialValue: null,
};

const defaultMultiSelectProperties: OptionalSelectDropdownMultiProperties<
  UI.BaseGeneric.Required,
  UI.SelectOption.List
> = {
  label: null,
  required: true,
  description: null,
  validate: null,
  style: null,
  onChange: null,
  initialValue: [],
  minSelections: MULTI_SELECTION_MIN_DEFAULT,
  maxSelections: MULTI_SELECTION_MAX_DEFAULT,
};

/**
 * Generate a radio group select component. For example:
 *
 * ```typescript
 * page.add(() =>
 *  ui.radioGroup("tier", ["free", "pro", "enterprise"], {
 *    onChange: (value) => page.toast(`You selected ${value}`);
 *  })
 * );
 * ```
 *
 * Or as part of a form:
 *
 * ```typescript
 * page.add(() => ui.form(
 *  "myForm",
 *  [
 *    ui.textInput("companyName"),
 *    ui.radioGroup("tier", ["free", "pro", "enterprise"])
 *  ],
 *  {
 *    onSubmit: (formData) => {
 *      const { companyName, tier } = formData;
 *    },
 *  }
 * ));
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/radio-group documentation}
 *
 * @param {string} id - Unique id to identify the component.
 * @param {TOptions} options - The options to display in the radio group. Should be an array of strings or objects with `label` and `value` properties.
 * @param {Partial<OptionalRadioGroupProperties<TRequired, TOptions>>} properties - Optional properties to configure the radio group component.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["label"]} properties.label - Label to display above the radio group.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["description"]} properties.description - Description to display below the label.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["required"]} properties.required - Whether the radio group is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["onChange"]} properties.onChange - Callback function that is called when the user selects an option.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["initialValue"]} properties.initialValue - The initial value of the radio group. Defaults to `null`.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["style"]} properties.style - CSS styles object to directly style the radio group HTML element.
 * @returns The configured radio group component.
 */
function radioGroup<
  TId extends UI.BaseGeneric.Id,
  TRequired extends true,
  TOptions extends UI.SelectOption.List,
>(
  id: TId,
  options: TOptions,
  properties?: Partial<OptionalRadioGroupProperties<TRequired, TOptions>>
): UI.OutputOmittedComponents.InputRadioGroup<TId, TRequired, TOptions>;

/**
 * Generate a radio group select component. For example:
 *
 * ```typescript
 * page.add(() =>
 *  ui.radioGroup("tier", ["free", "pro", "enterprise"], {
 *    onChange: (value) => page.toast(`You selected ${value}`);
 *  })
 * );
 * ```
 *
 * Or as part of a form:
 *
 * ```typescript
 * page.add(() => ui.form(
 *  "myForm",
 *  [
 *    ui.textInput("companyName"),
 *    ui.radioGroup("tier", ["free", "pro", "enterprise"])
 *  ],
 *  {
 *    onSubmit: (formData) => {
 *      const { companyName, tier } = formData;
 *    },
 *  }
 * ));
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/radio-group documentation}
 *
 * @param {string} id - Unique id to identify the component.
 * @param {TOptions} options - The options to display in the radio group. Should be an array of strings or objects with `label` and `value` properties.
 * @param {Partial<OptionalRadioGroupProperties<TRequired, TOptions>>} properties - Optional properties to configure the radio group component.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["label"]} properties.label - Label to display above the radio group.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["description"]} properties.description - Description to display below the label.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["required"]} properties.required - Whether the radio group is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["onChange"]} properties.onChange - Callback function that is called when the user selects an option.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["initialValue"]} properties.initialValue - The initial value of the radio group. Defaults to `null`.
 * @param {OptionalRadioGroupProperties<TRequired, TOptions>["style"]} properties.style - CSS styles object to directly style the radio group HTML element.
 * @returns The configured radio group component.
 */
function radioGroup<
  TId extends UI.BaseGeneric.Id,
  TRequired extends false,
  TOptions extends UI.SelectOption.List,
>(
  id: TId,
  options: TOptions,
  properties?: Partial<OptionalRadioGroupProperties<TRequired, TOptions>>
): UI.OutputOmittedComponents.InputRadioGroup<TId, TRequired, TOptions>;

function radioGroup<
  TId extends UI.BaseGeneric.Id,
  TRequired extends UI.BaseGeneric.Required,
  TOptions extends UI.SelectOption.List,
>(
  id: TId,
  options: TOptions,
  properties: Partial<OptionalRadioGroupProperties<TRequired, TOptions>> = {}
): UI.OutputOmittedComponents.InputRadioGroup<TId, TRequired, TOptions> {
  if (!Array.isArray(options)) {
    throw new Error("options must be an array for radio group");
  }

  const mergedProperties = {
    ...defaultSelectProperties,
    ...properties,
  };

  const shallowCopy = [...options] as unknown as TOptions;

  return {
    model: {
      id,
      label: mergedProperties.label,
      description: mergedProperties.description,
      required: mergedProperties.required as TRequired,
      hasValidateHook: mergedProperties.validate !== null,
      properties: {
        options: shallowCopy,
        initialValue: mergedProperties.initialValue,
        hasOnSelectHook: mergedProperties.onChange !== null,
      },
      style: mergedProperties.style,
    },
    hooks: {
      validate:
        mergedProperties.validate as UI.OutputOmittedComponents.InputRadioGroup<
          TId,
          TRequired,
          TOptions
        >["hooks"]["validate"],
      onSelect:
        mergedProperties.onChange as UI.OutputOmittedComponents.InputRadioGroup<
          TId,
          TRequired,
          TOptions
        >["hooks"]["onSelect"],
    },
    type: UI.TYPE.INPUT_RADIO_GROUP,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

/**
 * Generate a select dropdown component. For example:
 *
 * ```typescript
 * page.add(() =>
 *  ui.selectBox("tier", ["free", "pro", "enterprise"], {
 *    onChange: (value) => page.toast(`You selected ${value}`);
 *  })
 * );
 * ```
 *
 * Or as part of a form:
 *
 * ```typescript
 * page.add(() => ui.form(
 *  "myForm",
 *  [
 *    ui.textInput("companyName"),
 *    ui.selectBox("tier", ["free", "pro", "enterprise"])
 *  ],
 *  {
 *    onSubmit: (formData) => {
 *      const { companyName, tier } = formData;
 *    },
 *  }
 * ));
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/select-box documentation}
 *
 * @param {string} id - Unique id to identify the component.
 * @param {TOptions} options - The options to display in the select dropdown. Should be an array of strings or objects with `label` and `value` properties.
 * @param {Partial<OptionalSelectDropdownSingleProperties<TRequired, TOptions>>} properties - Optional properties to configure the select dropdown component.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["label"]} properties.label - Label to display above the select dropdown.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["description"]} properties.description - Description to display below the label.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["required"]} properties.required - Whether the select dropdown is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["onChange"]} properties.onChange - Callback function that is called when the user selects an option.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["initialValue"]} properties.initialValue - The initial value of the select dropdown. Defaults to `null`.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["style"]} properties.style - CSS styles object to directly style the select dropdown HTML element.
 * @returns The configured select dropdown component.
 */
function selectDropdownSingle<
  TId extends UI.BaseGeneric.Id,
  TRequired extends true,
  TOptions extends UI.SelectOption.List,
>(
  id: TId,
  options: TOptions,
  properties?: Partial<
    OptionalSelectDropdownSingleProperties<TRequired, TOptions>
  >
): UI.OutputOmittedComponents.InputSelectDropdown<TId, TRequired, TOptions>;

/**
 * Generate a select dropdown component. For example:
 *
 * ```typescript
 * page.add(() =>
 *  ui.selectBox("tier", ["free", "pro", "enterprise"], {
 *    onChange: (value) => page.toast(`You selected ${value}`);
 *  })
 * );
 * ```
 *
 * Or as part of a form:
 *
 * ```typescript
 * page.add(() => ui.form(
 *  "myForm",
 *  [
 *    ui.textInput("companyName"),
 *    ui.selectBox("tier", ["free", "pro", "enterprise"])
 *  ],
 *  {
 *    onSubmit: (formData) => {
 *      const { companyName, tier } = formData;
 *    },
 *  }
 * ));
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/select-box documentation}
 *
 * @param {string} id - Unique id to identify the component.
 * @param {TOptions} options - The options to display in the select dropdown. Should be an array of strings or objects with `label` and `value` properties.
 * @param {Partial<OptionalSelectDropdownSingleProperties<TRequired, TOptions>>} properties - Optional properties to configure the select dropdown component.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["label"]} properties.label - Label to display above the select dropdown.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["description"]} properties.description - Description to display below the label.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["required"]} properties.required - Whether the select dropdown is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["onChange"]} properties.onChange - Callback function that is called when the user selects an option.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["initialValue"]} properties.initialValue - The initial value of the select dropdown. Defaults to `null`.
 * @param {OptionalSelectDropdownSingleProperties<TRequired, TOptions>["style"]} properties.style - CSS styles object to directly style the select dropdown HTML element.
 * @returns The configured select dropdown component.
 */
function selectDropdownSingle<
  TId extends UI.BaseGeneric.Id,
  TRequired extends false,
  TOptions extends UI.SelectOption.List,
>(
  id: TId,
  options: TOptions,
  properties?: Partial<
    OptionalSelectDropdownSingleProperties<TRequired, TOptions>
  >
): UI.OutputOmittedComponents.InputSelectDropdown<TId, TRequired, TOptions>;

function selectDropdownSingle<
  TId extends UI.BaseGeneric.Id,
  TRequired extends UI.BaseGeneric.Required,
  TOptions extends UI.SelectOption.List,
>(
  id: TId,
  options: TOptions,
  properties: Partial<
    OptionalSelectDropdownSingleProperties<TRequired, TOptions>
  > = {}
): UI.OutputOmittedComponents.InputSelectDropdown<TId, TRequired, TOptions> {
  if (!Array.isArray(options)) {
    throw new Error("options must be an array for select dropdown");
  }

  const mergedProperties = {
    ...defaultSelectProperties,
    ...properties,
  };

  const shallowCopy = [...options] as unknown as TOptions;

  return {
    model: {
      id,
      label: mergedProperties.label,
      description: mergedProperties.description,
      required: mergedProperties.required as TRequired,
      hasValidateHook: mergedProperties.validate !== null,
      properties: {
        options: shallowCopy,
        initialValue: mergedProperties.initialValue,
        hasOnSelectHook: mergedProperties.onChange !== null,
      },
      style: mergedProperties.style,
    },
    hooks: {
      validate:
        mergedProperties.validate as UI.OutputOmittedComponents.InputSelectDropdown<
          TId,
          TRequired,
          TOptions
        >["hooks"]["validate"],
      onSelect:
        mergedProperties.onChange as UI.OutputOmittedComponents.InputSelectDropdown<
          TId,
          TRequired,
          TOptions
        >["hooks"]["onSelect"],
    },
    type: UI.TYPE.INPUT_SELECT_DROPDOWN_SINGLE,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

/**
 * Generate a multi-select dropdown component. For example:
 *
 * ```typescript
 * page.add(() =>
 *  ui.multiSelectBox("assignees", ["Sam", "John", "Jane"], {
 *    onChange: (values) => page.toast(`You selected ${values.join(", ")}`);
 *  })
 * );
 * ```
 *
 * Or as part of a form:
 *
 * ```typescript
 * page.add(() => ui.form(
 *  "myForm",
 *  [
 *    ui.textInput("ticketName"),
 *    ui.multiSelectBox("assignees", ["Sam", "John", "Jane"])
 *  ],
 *  {
 *    onSubmit: (formData) => {
 *      const { ticketName, assignees } = formData;
 *    },
 *  }
 * ));
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/multi-select-box documentation}
 *
 * @param {string} id - Unique id to identify the component.
 * @param {TOptions} options - The options to display in the multi-select dropdown. Should be an array of strings or objects with `label` and `value` properties.
 * @param {Partial<OptionalSelectDropdownMultiProperties<TRequired, TOptions>>} properties - Optional properties to configure the multi-select dropdown component.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["label"]} properties.label - Label to display above the multi-select dropdown.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["description"]} properties.description - Description to display below the label.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["required"]} properties.required - Whether the multi-select dropdown is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["onChange"]} properties.onChange - Callback function that is called when the user selects options.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["initialValue"]} properties.initialValue - The initial value of the multi-select dropdown. Defaults to `null`.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["minSelections"]} properties.minSelections - The minimum number of selections allowed. Defaults to 0.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["maxSelections"]} properties.maxSelections - The maximum number of selections allowed. Defaults to 1000000000.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["style"]} properties.style - CSS styles object to directly style the multi-select dropdown HTML element.
 * @returns The configured multi-select dropdown component.
 */
function selectDropdownMulti<
  TId extends UI.BaseGeneric.Id,
  TRequired extends true,
  TOptions extends UI.SelectOption.List,
>(
  id: TId,
  options: TOptions,
  properties?: Partial<
    OptionalSelectDropdownMultiProperties<TRequired, TOptions>
  >
): UI.OutputOmittedComponents.InputMultiSelectDropdown<
  TId,
  TRequired,
  TOptions
>;

/**
 * Generate a multi-select dropdown component. For example:
 *
 * ```typescript
 * page.add(() =>
 *  ui.multiSelectBox("assignees", ["Sam", "John", "Jane"], {
 *    onChange: (values) => page.toast(`You selected ${values.join(", ")}`);
 *  })
 * );
 * ```
 *
 * Or as part of a form:
 *
 * ```typescript
 * page.add(() => ui.form(
 *  "myForm",
 *  [
 *    ui.textInput("ticketName"),
 *    ui.multiSelectBox("assignees", ["Sam", "John", "Jane"])
 *  ],
 *  {
 *    onSubmit: (formData) => {
 *      const { ticketName, assignees } = formData;
 *    },
 *  }
 * ));
 * ```
 *
 * Read the full {@link https://docs.composehq.com/components/input/multi-select-box documentation}
 *
 * @param {string} id - Unique id to identify the component.
 * @param {TOptions} options - The options to display in the multi-select dropdown. Should be an array of strings or objects with `label` and `value` properties.
 * @param {Partial<OptionalSelectDropdownMultiProperties<TRequired, TOptions>>} properties - Optional properties to configure the multi-select dropdown component.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["label"]} properties.label - Label to display above the multi-select dropdown.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["description"]} properties.description - Description to display below the label.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["required"]} properties.required - Whether the multi-select dropdown is required (e.g. part of a form). Defaults to `true`.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["validate"]} properties.validate - Custom function to validate the user's input. Return nothing if valid, or a string error message if invalid.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["onChange"]} properties.onChange - Callback function that is called when the user selects options.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["initialValue"]} properties.initialValue - The initial value of the multi-select dropdown. Defaults to `null`.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["minSelections"]} properties.minSelections - The minimum number of selections allowed. Defaults to 0.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["maxSelections"]} properties.maxSelections - The maximum number of selections allowed. Defaults to 1000000000.
 * @param {OptionalSelectDropdownMultiProperties<TRequired, TOptions>["style"]} properties.style - CSS styles object to directly style the multi-select dropdown HTML element.
 * @returns The configured multi-select dropdown component.
 */
function selectDropdownMulti<
  TId extends UI.BaseGeneric.Id,
  TRequired extends false,
  TOptions extends UI.SelectOption.List,
>(
  id: TId,
  options: TOptions,
  properties?: Partial<
    OptionalSelectDropdownMultiProperties<TRequired, TOptions>
  >
): UI.OutputOmittedComponents.InputMultiSelectDropdown<
  TId,
  TRequired,
  TOptions
>;

function selectDropdownMulti<
  TId extends UI.BaseGeneric.Id,
  TRequired extends UI.BaseGeneric.Required,
  TOptions extends UI.SelectOption.List,
>(
  id: TId,
  options: TOptions,
  properties: Partial<
    OptionalSelectDropdownMultiProperties<TRequired, TOptions>
  > = {}
): UI.OutputOmittedComponents.InputMultiSelectDropdown<
  TId,
  TRequired,
  TOptions
> {
  if (!Array.isArray(options)) {
    throw new Error("options must be an array for select dropdown");
  }

  const mergedProperties = {
    ...defaultMultiSelectProperties,
    ...properties,
  };

  if (!Array.isArray(mergedProperties.initialValue)) {
    throw new Error("initialValue must be an array for multiselect box");
  }

  const shallowCopy = [...options] as unknown as TOptions;

  return {
    model: {
      id,
      label: mergedProperties.label,
      description: mergedProperties.description,
      required: mergedProperties.required as TRequired,
      hasValidateHook: mergedProperties.validate !== null,
      properties: {
        options: shallowCopy,
        initialValue: mergedProperties.initialValue,
        minSelections: mergedProperties.minSelections,
        maxSelections: mergedProperties.maxSelections,
        hasOnSelectHook: mergedProperties.onChange !== null,
      },
      style: mergedProperties.style,
    },
    hooks: {
      validate:
        mergedProperties.validate as UI.OutputOmittedComponents.InputMultiSelectDropdown<
          TId,
          TRequired,
          TOptions
        >["hooks"]["validate"],
      onSelect:
        mergedProperties.onChange as UI.OutputOmittedComponents.InputMultiSelectDropdown<
          TId,
          TRequired,
          TOptions
        >["hooks"]["onSelect"],
    },
    type: UI.TYPE.INPUT_SELECT_DROPDOWN_MULTI,
    interactionType: UI.INTERACTION_TYPE.INPUT,
  };
}

export { radioGroup, selectDropdownSingle, selectDropdownMulti };
