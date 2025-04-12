import { INTERACTION_TYPE, OmitUnion } from "./types";
import * as Components from "./components";

type OmitKeys = "output" | "hooks";

export type InputText = Omit<Components.InputText, OmitKeys>;

export type InputEmail = Omit<Components.InputEmail, OmitKeys>;

export type InputUrl = Omit<Components.InputUrl, OmitKeys>;

export type InputNumber = Omit<Components.InputNumber, OmitKeys>;

export type InputPassword = Omit<Components.InputPassword, OmitKeys>;

export type InputRadioGroup = Omit<Components.InputRadioGroup, OmitKeys>;

export type InputSelectDropdown = Omit<
  Components.InputSelectDropdown,
  OmitKeys
>;

export type InputMultiSelectDropdown = Omit<
  Components.InputMultiSelectDropdown,
  OmitKeys
>;

export type InputTable = Omit<Components.InputTable, OmitKeys>;

export type InputFileDrop = Omit<Components.InputFileDrop, OmitKeys>;

export type InputDate = Omit<Components.InputDate, OmitKeys>;

export type InputTime = Omit<Components.InputTime, OmitKeys>;

export type InputDateTime = Omit<Components.InputDateTime, OmitKeys>;

export type InputTextArea = Omit<Components.InputTextArea, OmitKeys>;

export type InputJson = Omit<Components.InputJson, OmitKeys>;

export type InputCheckbox = Omit<Components.InputCheckbox, OmitKeys>;

export type ButtonBarChart = Omit<Components.ButtonBarChart, OmitKeys>;

export type ButtonLineChart = Omit<Components.ButtonLineChart, OmitKeys>;

export type ButtonDefault = Omit<Components.ButtonDefault, OmitKeys>;

export type ButtonFormSubmit = Omit<Components.ButtonFormSubmit, OmitKeys>;

export type DisplayNone = Omit<Components.DisplayNone, OmitKeys>;

export type DisplayText = Omit<Components.DisplayText, OmitKeys>;

export type DisplayHeader = Omit<Components.DisplayHeader, OmitKeys>;

export type DisplayJson = Omit<Components.DisplayJson, OmitKeys>;

export type DisplaySpinner = Omit<Components.DisplaySpinner, OmitKeys>;

export type DisplayCode = Omit<Components.DisplayCode, OmitKeys>;

export type DisplayImage = Omit<Components.DisplayImage, OmitKeys>;

export type DisplayMarkdown = Omit<Components.DisplayMarkdown, OmitKeys>;

export type DisplayPdf = Omit<Components.DisplayPdf, OmitKeys>;

export type DisplayDivider = Omit<Components.DisplayDivider, OmitKeys>;

export type LayoutStack = Omit<Components.LayoutStack, OmitKeys>;

export type LayoutForm = Omit<Components.LayoutForm, OmitKeys>;

export type PageConfirm = Omit<Components.PageConfirm, OmitKeys>;

export type All = OmitUnion<Components.All, OmitKeys>;

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
