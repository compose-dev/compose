import { Table, DateTime, BaseInputValue, Factory } from "../types";
import { TYPE } from "../types";

export interface Base {
  internalValue: any;
  networkTransferValue: any;
  customerReturnedValue: any;
}

export interface InputText extends Base {
  internalValue: Factory.Nullable<BaseInputValue.Text>;
  networkTransferValue: Factory.Nullable<BaseInputValue.Text>;
  customerReturnedValue: Factory.Nullable<BaseInputValue.Text>;
}

export interface InputEmail extends Base {
  internalValue: Factory.Nullable<BaseInputValue.Email>;
  networkTransferValue: Factory.Nullable<BaseInputValue.Email>;
  customerReturnedValue: Factory.Nullable<BaseInputValue.Email>;
}

export interface InputUrl extends Base {
  internalValue: Factory.Nullable<BaseInputValue.Url>;
  networkTransferValue: Factory.Nullable<BaseInputValue.Url>;
  customerReturnedValue: Factory.Nullable<BaseInputValue.Url>;
}

export interface InputNumber extends Base {
  internalValue: Factory.Nullable<string>;
  networkTransferValue: Factory.Nullable<BaseInputValue.Number>;
  customerReturnedValue: Factory.Nullable<BaseInputValue.Number>;
}

export interface InputPassword extends Base {
  internalValue: Factory.Nullable<BaseInputValue.Password>;
  networkTransferValue: Factory.Nullable<BaseInputValue.Password>;
  customerReturnedValue: Factory.Nullable<BaseInputValue.Password>;
}

export interface InputRadioGroup extends Base {
  internalValue: Factory.Nullable<BaseInputValue.RadioGroup>;
  networkTransferValue: Factory.Nullable<BaseInputValue.RadioGroup>;
  customerReturnedValue: Factory.Nullable<BaseInputValue.RadioGroup>;
}

export interface InputSelectDropdown extends Base {
  internalValue: Factory.Nullable<BaseInputValue.SelectDropdown>;
  networkTransferValue: Factory.Nullable<BaseInputValue.SelectDropdown>;
  customerReturnedValue: Factory.Nullable<BaseInputValue.SelectDropdown>;
}

export interface InputMultiSelectDropdown extends Base {
  internalValue: BaseInputValue.MultiSelectDropdown;
  networkTransferValue: BaseInputValue.MultiSelectDropdown;
  customerReturnedValue: BaseInputValue.MultiSelectDropdown;
}

export interface InputTable extends Base {
  internalValue: Record<number, boolean>;
  // v2 of the table model switched to only sending the row indices
  // and hydrating on the SDK side.
  networkTransferValue:
    | Table.DataRow[]
    | {
        value: number[];
        type: typeof TYPE.INPUT_TABLE;
      };
  customerReturnedValue: BaseInputValue.Table;
}

export interface InputFileDrop extends Base {
  internalValue: File[];
  networkTransferValue: {
    fileId: string;
    fileName: string;
    fileSize: number;
    fileType: string;
  }[];
  customerReturnedValue: BaseInputValue.FileDrop;
}

export interface InputDate extends Base {
  internalValue: Factory.Nullable<DateTime.DateRepresentation>;
  networkTransferValue: {
    value: Factory.Nullable<DateTime.DateRepresentation>;
    type: typeof TYPE.INPUT_DATE;
  };
  customerReturnedValue: Factory.Nullable<BaseInputValue.Date>;
}

export interface InputTime extends Base {
  internalValue: Factory.Nullable<DateTime.TimeRepresentation>;
  networkTransferValue: {
    value: Factory.Nullable<DateTime.TimeRepresentation>;
    type: typeof TYPE.INPUT_TIME;
  };
  customerReturnedValue: Factory.Nullable<BaseInputValue.Time>;
}

export interface InputDateTime extends Base {
  internalValue: Factory.Nullable<DateTime.DateTimeRepresentation>;
  networkTransferValue: {
    value: Factory.Nullable<DateTime.DateTimeRepresentation>;
    type: typeof TYPE.INPUT_DATE_TIME;
  };
  customerReturnedValue: Factory.Nullable<BaseInputValue.DateTime>;
}

export interface InputTextArea extends Base {
  internalValue: Factory.Nullable<BaseInputValue.TextArea>;
  networkTransferValue: Factory.Nullable<BaseInputValue.TextArea>;
  customerReturnedValue: Factory.Nullable<BaseInputValue.TextArea>;
}

export interface InputJson extends Base {
  internalValue: Factory.Nullable<string>;
  networkTransferValue: {
    value: Factory.Nullable<string>;
    type: typeof TYPE.INPUT_JSON;
  };
  customerReturnedValue: Factory.Nullable<BaseInputValue.Json>;
}

export interface InputCheckbox extends Base {
  internalValue: BaseInputValue.Checkbox;
  networkTransferValue: BaseInputValue.Checkbox;
  customerReturnedValue: BaseInputValue.Checkbox;
}

export type ButtonBarChart = null;

export type ButtonLineChart = null;

export type ButtonDefault = null;

export type ButtonFormSubmit = null;

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

export type DisplayStatistic = null;

export type LayoutStack = null;

export type LayoutForm = null;

export type PageConfirm = null;

export type All =
  | InputText
  | InputEmail
  | InputUrl
  | InputNumber
  | InputPassword
  | InputRadioGroup
  | InputSelectDropdown
  | InputMultiSelectDropdown
  | InputTable
  | InputFileDrop
  | InputDate
  | InputTime
  | InputDateTime
  | InputTextArea
  | InputJson
  | InputCheckbox
  | ButtonBarChart
  | ButtonLineChart
  | ButtonDefault
  | ButtonFormSubmit
  | DisplayText
  | DisplayHeader
  | DisplayJson
  | DisplaySpinner
  | DisplayCode
  | DisplayImage
  | DisplayMarkdown
  | DisplayPdf
  | DisplayDivider
  | DisplayStatistic
  | LayoutStack
  | LayoutForm;

export type PageAll = PageConfirm;
