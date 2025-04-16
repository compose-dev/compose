import * as Components from "./components";
import { INTERACTION_TYPE, PickUnion } from "./types";

type PickKeys = "type" | "interactionType" | "output";

export type InputText = Pick<Components.InputText, PickKeys>;

export type InputEmail = Pick<Components.InputEmail, PickKeys>;

export type InputUrl = Pick<Components.InputUrl, PickKeys>;

export type InputNumber = Pick<Components.InputNumber, PickKeys>;

export type InputPassword = Pick<Components.InputPassword, PickKeys>;

export type InputRadioGroup = Pick<Components.InputRadioGroup, PickKeys>;

export type InputSelectDropdown = Pick<
  Components.InputSelectDropdown,
  PickKeys
>;

export type InputMultiSelectDropdown = Pick<
  Components.InputMultiSelectDropdown,
  PickKeys
>;

export type InputTable = Pick<Components.InputTable, PickKeys>;

export type InputFileDrop = Pick<Components.InputFileDrop, PickKeys>;

export type InputDate = Pick<Components.InputDate, PickKeys>;

export type InputTime = Pick<Components.InputTime, PickKeys>;

export type InputDateTime = Pick<Components.InputDateTime, PickKeys>;

export type InputTextArea = Pick<Components.InputTextArea, PickKeys>;

export type InputJson = Pick<Components.InputJson, PickKeys>;

export type InputCheckbox = Pick<Components.InputCheckbox, PickKeys>;

export type ButtonDefault = Pick<Components.ButtonDefault, PickKeys>;

export type ButtonFormSubmit = Pick<Components.ButtonFormSubmit, PickKeys>;

export type ButtonBarChart = Pick<Components.ButtonBarChart, PickKeys>;

export type ButtonLineChart = Pick<Components.ButtonLineChart, PickKeys>;

export type DisplayNone = Pick<Components.DisplayNone, PickKeys>;

export type DisplayText = Pick<Components.DisplayText, PickKeys>;

export type DisplayHeader = Pick<Components.DisplayHeader, PickKeys>;

export type DisplayJson = Pick<Components.DisplayJson, PickKeys>;

export type DisplaySpinner = Pick<Components.DisplaySpinner, PickKeys>;

export type DisplayCode = Pick<Components.DisplayCode, PickKeys>;

export type DisplayImage = Pick<Components.DisplayImage, PickKeys>;

export type DisplayMarkdown = Pick<Components.DisplayMarkdown, PickKeys>;

export type DisplayPdf = Pick<Components.DisplayPdf, PickKeys>;

export type DisplayDivider = Pick<Components.DisplayDivider, PickKeys>;

export type DisplayStatistic = Pick<Components.DisplayStatistic, PickKeys>;

export type LayoutStack = Pick<Components.LayoutStack, PickKeys>;

export type LayoutForm = Pick<Components.LayoutForm, PickKeys>;

export type PageConfirm = Pick<Components.PageConfirm, PickKeys>;

export type All = PickUnion<Components.All, PickKeys>;

export type AllWithInputInteraction = Extract<
  All,
  { interactionType: typeof INTERACTION_TYPE.INPUT }
>;

export type AllWithButtonInteraction = Extract<
  All,
  { interactionType: typeof INTERACTION_TYPE.BUTTON }
>;

export type AllWithDisplayInteraction = Extract<
  All,
  { interactionType: typeof INTERACTION_TYPE.DISPLAY }
>;

export type AllWithLayoutInteraction = Extract<
  All,
  { interactionType: typeof INTERACTION_TYPE.LAYOUT }
>;
