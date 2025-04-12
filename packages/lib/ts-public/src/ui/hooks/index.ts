import * as Components from "../components";
import {
  ValidatorResponse,
  Factory,
  BaseInputValue,
  BaseGeneric,
  Table as TTable,
  SelectOption,
} from "../types";

interface BaseWithInputInteraction {
  validate: Factory.Nullable<(value: any) => ValidatorResponse>;
}

interface BaseWithInputEnterInteraction<
  TBaseInputValue,
  TRequired extends BaseGeneric.Required,
> extends BaseWithInputInteraction {
  validate: Factory.Nullable<
    Factory.NullableValidatorCallback<TBaseInputValue, TRequired>
  >;
  onEnter: Factory.Nullable<
    Factory.NullableInputValueCallback<TBaseInputValue, TRequired>
  >;
}

interface BaseWithInputSelectInteraction<
  TRequired extends BaseGeneric.Required,
  TOptions extends SelectOption.List,
> extends BaseWithInputInteraction {
  validate: Factory.Nullable<
    Factory.NullableValidatorCallback<
      SelectOption.ExtractOptionValue<TOptions[number]>,
      TRequired
    >
  >;
  onSelect: Factory.Nullable<
    Factory.NullableInputValueCallback<
      SelectOption.ExtractOptionValue<TOptions[number]>,
      TRequired
    >
  >;
}

interface BaseWithInputMultiSelectInteraction<
  TOptions extends SelectOption.List,
> extends BaseWithInputInteraction {
  validate: Factory.Nullable<
    Factory.ValidatorCallback<
      SelectOption.ExtractOptionValue<TOptions[number]>[]
    >
  >;
  onSelect: Factory.Nullable<
    Factory.InputValueCallback<
      SelectOption.ExtractOptionValue<TOptions[number]>[]
    >
  >;
}

export interface InputText<TRequired extends BaseGeneric.Required>
  extends BaseWithInputEnterInteraction<BaseInputValue.Text, TRequired> {}

export interface InputEmail<TRequired extends BaseGeneric.Required>
  extends BaseWithInputEnterInteraction<BaseInputValue.Email, TRequired> {}

export interface InputUrl<TRequired extends BaseGeneric.Required>
  extends BaseWithInputEnterInteraction<BaseInputValue.Url, TRequired> {}

export interface InputNumber<TRequired extends BaseGeneric.Required>
  extends BaseWithInputEnterInteraction<BaseInputValue.Number, TRequired> {}

export interface InputPassword<TRequired extends BaseGeneric.Required>
  extends BaseWithInputEnterInteraction<BaseInputValue.Password, TRequired> {}

export interface InputDate<TRequired extends BaseGeneric.Required>
  extends BaseWithInputEnterInteraction<BaseInputValue.Date, TRequired> {}

export interface InputTime<TRequired extends BaseGeneric.Required>
  extends BaseWithInputEnterInteraction<BaseInputValue.Time, TRequired> {}

export interface InputDateTime<TRequired extends BaseGeneric.Required>
  extends BaseWithInputEnterInteraction<BaseInputValue.DateTime, TRequired> {}

export interface InputTextArea<TRequired extends BaseGeneric.Required>
  extends BaseWithInputEnterInteraction<BaseInputValue.TextArea, TRequired> {}

export interface InputJson<TRequired extends BaseGeneric.Required>
  extends BaseWithInputEnterInteraction<BaseInputValue.Json, TRequired> {}

export interface InputRadioGroup<
  TRequired extends BaseGeneric.Required,
  TOptions extends SelectOption.List,
> extends BaseWithInputSelectInteraction<TRequired, TOptions> {}

export interface InputSelectDropdown<
  TRequired extends BaseGeneric.Required,
  TOptions extends SelectOption.List,
> extends BaseWithInputSelectInteraction<TRequired, TOptions> {}

export interface InputMultiSelectDropdown<TOptions extends SelectOption.List>
  extends BaseWithInputMultiSelectInteraction<TOptions> {}

export interface InputCheckbox extends BaseWithInputInteraction {
  validate: Factory.Nullable<
    Factory.ValidatorCallback<BaseInputValue.Checkbox>
  >;
  onSelect: Factory.Nullable<
    Factory.InputValueCallback<BaseInputValue.Checkbox>
  >;
}

export interface InputTable extends BaseWithInputInteraction {
  validate: Factory.Nullable<Factory.ValidatorCallback<BaseInputValue.Table>>;
  onSelect: Factory.Nullable<Factory.InputValueCallback<BaseInputValue.Table>>;
  onRowActions:
    | ((
        value: Components.InputTable["output"]["customerReturnedValue"][number],
        index: number
      ) => void)[]
    | null;
  onPageChange:
    | {
        fn: TTable.OnPageChange<TTable.DataRow[]>;
        type: typeof TTable.PAGINATION_TYPE.MANUAL;
      }
    | {
        fn: () => TTable.DataRow[];
        type: typeof TTable.PAGINATION_TYPE.AUTO;
      }
    | null;
}

export interface InputFileDrop extends BaseWithInputInteraction {
  validate: Factory.Nullable<
    Factory.ValidatorCallback<BaseInputValue.FileDrop>
  >;
  onFileChange: Factory.Nullable<
    Factory.InputValueCallback<BaseInputValue.FileDrop>
  >;
}

interface BaseWithButtonInteraction {}

export interface ButtonDefault extends BaseWithButtonInteraction {
  onClick: (() => void) | null;
}

export interface ButtonFormSubmit extends BaseWithButtonInteraction {
  onClick: (() => void) | null;
}

export interface ButtonBarChart extends BaseWithButtonInteraction {}

export interface ButtonLineChart extends BaseWithButtonInteraction {}

export type DisplayNone = null;

export type DisplayText = null;

export type DisplayHeader = null;

export type DisplayJson = null;

export type DisplaySpinner = null;

export type DisplayCode = null;

export type DisplayImage = null;

export type DisplayMarkdown = null;

export type DisplayPdf = null;

export type DisplayDivider = null;

export type LayoutStack = null;

export type LayoutForm = {
  onSubmit: Factory.Nullable<Factory.InputValueCallback<Record<any, any>>>;
  validate: Factory.Nullable<Factory.ValidatorCallback<Record<any, any>>>;
};

export type PageConfirm = {
  onResponse: (response: boolean) => void;
};

export type All<
  TRequired extends BaseGeneric.Required,
  TOptions extends SelectOption.List,
> =
  | InputText<TRequired>
  | InputEmail<TRequired>
  | InputUrl<TRequired>
  | InputNumber<TRequired>
  | InputPassword<TRequired>
  | InputRadioGroup<TRequired, TOptions>
  | InputSelectDropdown<TRequired, TOptions>
  | InputDate<TRequired>
  | InputTime<TRequired>
  | InputDateTime<TRequired>
  | InputTextArea<TRequired>
  | InputJson<TRequired>
  | InputMultiSelectDropdown<TOptions>
  | InputTable
  | InputFileDrop
  | InputCheckbox
  | ButtonDefault
  | ButtonFormSubmit
  | ButtonBarChart
  | ButtonLineChart
  | DisplayText
  | DisplayHeader
  | DisplayJson
  | DisplaySpinner
  | DisplayCode
  | DisplayImage
  | DisplayMarkdown
  | DisplayPdf
  | DisplayDivider
  | LayoutStack
  | LayoutForm;

export type PageAll = PageConfirm;
