import {
  TYPE,
  type Type,
  INTERACTION_TYPE,
  type InteractionType,
  BaseGeneric,
  SelectOption,
} from "./types";

import * as Hooks from "./hooks";
import * as Model from "./model";
import * as Output from "./output";

interface Base {
  model:
    | Model.All<
        BaseGeneric.Id,
        BaseGeneric.Required,
        BaseGeneric.Children,
        SelectOption.List
      >
    | Model.PageAll<BaseGeneric.Id>;
  output: Output.All | Output.PageAll;
  hooks: Hooks.All<BaseGeneric.Required, SelectOption.List> | Hooks.PageAll;
  type: Type;
  interactionType: InteractionType;
}

export interface InputText<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> extends Base {
  model: Model.InputInteraction.Text<TId, TRequired>;
  output: Output.InputText;
  hooks: Hooks.InputText<TRequired>;
  type: typeof TYPE.INPUT_TEXT;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputEmail<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> extends Base {
  model: Model.InputInteraction.Email<TId, TRequired>;
  output: Output.InputEmail;
  hooks: Hooks.InputEmail<TRequired>;
  type: typeof TYPE.INPUT_EMAIL;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputUrl<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> extends Base {
  model: Model.InputInteraction.Url<TId, TRequired>;
  output: Output.InputUrl;
  hooks: Hooks.InputUrl<TRequired>;
  type: typeof TYPE.INPUT_URL;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputNumber<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> extends Base {
  model: Model.InputInteraction.Number<TId, TRequired>;
  output: Output.InputNumber;
  hooks: Hooks.InputNumber<TRequired>;
  type: typeof TYPE.INPUT_NUMBER;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputPassword<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> extends Base {
  model: Model.InputInteraction.Password<TId, TRequired>;
  output: Output.InputPassword;
  hooks: Hooks.InputPassword<TRequired>;
  type: typeof TYPE.INPUT_PASSWORD;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputRadioGroup<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
  TOptions extends SelectOption.List = SelectOption.List,
> extends Base {
  model: Model.InputInteraction.RadioGroup<TId, TRequired, TOptions>;
  output: Output.InputRadioGroup;
  /**
   * We pass the more generic `SelectOption.List` here instead of TOptions
   * because the hooks use TOptions as a parameter for internal callbacks,
   * which makes the type invariant, instead of covariant.
   */
  hooks: Hooks.InputRadioGroup<TRequired, SelectOption.List>;
  type: typeof TYPE.INPUT_RADIO_GROUP;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputSelectDropdown<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
  TOptions extends SelectOption.List = SelectOption.List,
> extends Base {
  model: Model.InputInteraction.SelectDropdown<TId, TRequired, TOptions>;
  output: Output.InputSelectDropdown;
  /**
   * We pass the more generic `SelectOption.List` here instead of TOptions
   * because the hooks use TOptions as a parameter for internal callbacks,
   * which makes the type invariant, instead of covariant.
   */
  hooks: Hooks.InputSelectDropdown<TRequired, SelectOption.List>;
  type: typeof TYPE.INPUT_SELECT_DROPDOWN_SINGLE;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputMultiSelectDropdown<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
  TOptions extends SelectOption.List = SelectOption.List,
> extends Base {
  model: Model.InputInteraction.MultiSelectDropdown<TId, TRequired, TOptions>;
  output: Output.InputMultiSelectDropdown;
  /**
   * We pass the more generic `SelectOption.List` here instead of TOptions
   * because the hooks use TOptions as a parameter for internal callbacks,
   * which makes the type invariant, instead of covariant.
   */
  hooks: Hooks.InputMultiSelectDropdown<SelectOption.List>;
  type: typeof TYPE.INPUT_SELECT_DROPDOWN_MULTI;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputTable<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> extends Base {
  model: Model.InputInteraction.Table<TId, TRequired>;
  output: Output.InputTable;
  hooks: Hooks.InputTable;
  type: typeof TYPE.INPUT_TABLE;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputFileDrop<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> extends Base {
  model: Model.InputInteraction.FileDrop<TId, TRequired>;
  output: Output.InputFileDrop;
  hooks: Hooks.InputFileDrop;
  type: typeof TYPE.INPUT_FILE_DROP;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputDate<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> extends Base {
  model: Model.InputInteraction.Date<TId, TRequired>;
  output: Output.InputDate;
  hooks: Hooks.InputDate<TRequired>;
  type: typeof TYPE.INPUT_DATE;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputTime<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> extends Base {
  model: Model.InputInteraction.Time<TId, TRequired>;
  output: Output.InputTime;
  hooks: Hooks.InputTime<TRequired>;
  type: typeof TYPE.INPUT_TIME;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputDateTime<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> extends Base {
  model: Model.InputInteraction.DateTime<TId, TRequired>;
  output: Output.InputDateTime;
  hooks: Hooks.InputDateTime<TRequired>;
  type: typeof TYPE.INPUT_DATE_TIME;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputTextArea<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> extends Base {
  model: Model.InputInteraction.TextArea<TId, TRequired>;
  output: Output.InputTextArea;
  hooks: Hooks.InputTextArea<TRequired>;
  type: typeof TYPE.INPUT_TEXT_AREA;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputJson<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> extends Base {
  model: Model.InputInteraction.Json<TId, TRequired>;
  output: Output.InputJson;
  hooks: Hooks.InputJson<TRequired>;
  type: typeof TYPE.INPUT_JSON;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface InputCheckbox<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> extends Base {
  model: Model.InputInteraction.Checkbox<TId, TRequired>;
  output: Output.InputCheckbox;
  hooks: Hooks.InputCheckbox;
  type: typeof TYPE.INPUT_CHECKBOX;
  interactionType: typeof INTERACTION_TYPE.INPUT;
}

export interface ButtonBarChart<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.ButtonInteraction.BarChart<TId>;
  output: Output.ButtonBarChart;
  hooks: Hooks.ButtonBarChart;
  type: typeof TYPE.BUTTON_BAR_CHART;
  interactionType: typeof INTERACTION_TYPE.BUTTON;
}

export interface ButtonLineChart<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.ButtonInteraction.LineChart<TId>;
  output: Output.ButtonLineChart;
  hooks: Hooks.ButtonLineChart;
  type: typeof TYPE.BUTTON_LINE_CHART;
  interactionType: typeof INTERACTION_TYPE.BUTTON;
}

export interface ButtonDefault<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.ButtonInteraction.Default<TId>;
  output: Output.ButtonDefault;
  hooks: Hooks.ButtonDefault;
  type: typeof TYPE.BUTTON_DEFAULT;
  interactionType: typeof INTERACTION_TYPE.BUTTON;
}

export interface ButtonFormSubmit<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.ButtonInteraction.FormSubmit<TId>;
  output: Output.ButtonFormSubmit;
  hooks: Hooks.ButtonFormSubmit;
  type: typeof TYPE.BUTTON_FORM_SUBMIT;
  interactionType: typeof INTERACTION_TYPE.BUTTON;
}

export interface DisplayNone<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.DisplayInteraction.None<TId>;
  output: Output.DisplayNone;
  hooks: Hooks.DisplayNone;
  type: typeof TYPE.DISPLAY_NONE;
  interactionType: typeof INTERACTION_TYPE.DISPLAY;
}

export interface DisplayText<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.DisplayInteraction.Text<TId>;
  output: Output.DisplayText;
  hooks: Hooks.DisplayText;
  type: typeof TYPE.DISPLAY_TEXT;
  interactionType: typeof INTERACTION_TYPE.DISPLAY;
}

export interface DisplayHeader<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.DisplayInteraction.Header<TId>;
  output: Output.DisplayHeader;
  hooks: Hooks.DisplayHeader;
  type: typeof TYPE.DISPLAY_HEADER;
  interactionType: typeof INTERACTION_TYPE.DISPLAY;
}

export interface DisplayJson<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.DisplayInteraction.Json<TId>;
  output: Output.DisplayJson;
  hooks: Hooks.DisplayJson;
  type: typeof TYPE.DISPLAY_JSON;
  interactionType: typeof INTERACTION_TYPE.DISPLAY;
}

export interface DisplaySpinner<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.DisplayInteraction.Spinner<TId>;
  output: Output.DisplaySpinner;
  hooks: Hooks.DisplaySpinner;
  type: typeof TYPE.DISPLAY_SPINNER;
  interactionType: typeof INTERACTION_TYPE.DISPLAY;
}

export interface DisplayCode<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.DisplayInteraction.Code<TId>;
  output: Output.DisplayCode;
  hooks: Hooks.DisplayCode;
  type: typeof TYPE.DISPLAY_CODE;
  interactionType: typeof INTERACTION_TYPE.DISPLAY;
}

export interface DisplayImage<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.DisplayInteraction.Image<TId>;
  output: Output.DisplayImage;
  hooks: Hooks.DisplayImage;
  type: typeof TYPE.DISPLAY_IMAGE;
  interactionType: typeof INTERACTION_TYPE.DISPLAY;
}

export interface DisplayMarkdown<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.DisplayInteraction.Markdown<TId>;
  output: Output.DisplayMarkdown;
  hooks: Hooks.DisplayMarkdown;
  type: typeof TYPE.DISPLAY_MARKDOWN;
  interactionType: typeof INTERACTION_TYPE.DISPLAY;
}

export interface DisplayPdf<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.DisplayInteraction.Pdf<TId>;
  output: Output.DisplayPdf;
  hooks: Hooks.DisplayPdf;
  type: typeof TYPE.DISPLAY_PDF;
  interactionType: typeof INTERACTION_TYPE.DISPLAY;
}

export interface DisplayDivider<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.DisplayInteraction.Divider<TId>;
  output: Output.DisplayDivider;
  hooks: Hooks.DisplayDivider;
  type: typeof TYPE.DISPLAY_DIVIDER;
  interactionType: typeof INTERACTION_TYPE.DISPLAY;
}

export interface LayoutStack<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TChildren extends BaseGeneric.Children = BaseGeneric.Children,
> extends Base {
  model: Model.LayoutInteraction.Stack<TId, TChildren>;
  output: Output.LayoutStack;
  hooks: Hooks.LayoutStack;
  type: typeof TYPE.LAYOUT_STACK;
  interactionType: typeof INTERACTION_TYPE.LAYOUT;
}

export interface LayoutForm<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TChildren extends BaseGeneric.Children = BaseGeneric.Children,
> extends Base {
  model: Model.LayoutInteraction.Form<TId, TChildren>;
  output: Output.LayoutForm;
  hooks: Hooks.LayoutForm;
  type: typeof TYPE.LAYOUT_FORM;
  interactionType: typeof INTERACTION_TYPE.LAYOUT;
}

export interface PageConfirm<TId extends BaseGeneric.Id = BaseGeneric.Id>
  extends Base {
  model: Model.PageInteraction.Confirm<TId>;
  output: Output.PageConfirm;
  hooks: Hooks.PageConfirm;
  type: typeof TYPE.PAGE_CONFIRM;
  interactionType: typeof INTERACTION_TYPE.PAGE;
}

export type All<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
  TChildren extends BaseGeneric.Children = BaseGeneric.Children,
  TOptions extends SelectOption.List = SelectOption.List,
> =
  | InputText<TId, TRequired>
  | InputEmail<TId, TRequired>
  | InputUrl<TId, TRequired>
  | InputNumber<TId, TRequired>
  | InputPassword<TId, TRequired>
  | InputRadioGroup<TId, TRequired, TOptions>
  | InputSelectDropdown<TId, TRequired, TOptions>
  | InputMultiSelectDropdown<TId, TRequired, TOptions>
  | InputTable<TId, TRequired>
  | InputFileDrop<TId, TRequired>
  | InputDate<TId, TRequired>
  | InputTime<TId, TRequired>
  | InputDateTime<TId, TRequired>
  | InputTextArea<TId, TRequired>
  | InputJson<TId, TRequired>
  | InputCheckbox<TId, TRequired>
  | ButtonBarChart<TId>
  | ButtonLineChart<TId>
  | ButtonDefault<TId>
  | ButtonFormSubmit<TId>
  | DisplayNone<TId>
  | DisplayText<TId>
  | DisplayHeader<TId>
  | DisplayJson<TId>
  | DisplayCode<TId>
  | DisplaySpinner<TId>
  | DisplayImage<TId>
  | DisplayMarkdown<TId>
  | DisplayPdf<TId>
  | DisplayDivider<TId>
  | LayoutStack<TId, TChildren>
  | LayoutForm<TId, TChildren>;

export type AllWithInputInteraction<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
  TChildren extends BaseGeneric.Children = BaseGeneric.Children,
  TOptions extends SelectOption.List = SelectOption.List,
> = Extract<
  All<TId, TRequired, TChildren, TOptions>,
  { interactionType: typeof INTERACTION_TYPE.INPUT }
>;

export type AllWithButtonInteraction<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
  TChildren extends BaseGeneric.Children = BaseGeneric.Children,
  TOptions extends SelectOption.List = SelectOption.List,
> = Extract<
  All<TId, TRequired, TChildren, TOptions>,
  { interactionType: typeof INTERACTION_TYPE.BUTTON }
>;

export type AllWithDisplayInteraction<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
  TChildren extends BaseGeneric.Children = BaseGeneric.Children,
  TOptions extends SelectOption.List = SelectOption.List,
> = Extract<
  All<TId, TRequired, TChildren, TOptions>,
  { interactionType: typeof INTERACTION_TYPE.DISPLAY }
>;

export type AllWithLayoutInteraction<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
  TChildren extends BaseGeneric.Children = BaseGeneric.Children,
  TOptions extends SelectOption.List = SelectOption.List,
> = Extract<
  All<TId, TRequired, TChildren, TOptions>,
  { interactionType: typeof INTERACTION_TYPE.LAYOUT }
>;
