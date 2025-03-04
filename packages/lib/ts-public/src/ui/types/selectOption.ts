type SelectOptionValue = string | number | boolean;

type SelectOptionDict = {
  value: SelectOptionValue;
  label: string;
  description?: string;
};

type SelectOptionPrimitive = SelectOptionValue;

type SelectOption = SelectOptionDict | SelectOptionValue;

type SelectOptions = readonly SelectOption[];

type ExtractOptionValue<TOption extends SelectOption> =
  TOption extends SelectOptionDict ? TOption["value"] : TOption;

export {
  type SelectOptionValue as Value,
  type SelectOptionDict as AsDict,
  type SelectOptionPrimitive as AsPrimitive,
  type SelectOption as Type,
  type SelectOptions as List,
  type ExtractOptionValue,
};
