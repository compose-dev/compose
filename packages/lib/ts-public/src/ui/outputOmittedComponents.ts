import * as Components from "./components";
import {
  INTERACTION_TYPE,
  OmitUnion,
  BaseGeneric,
  SelectOption,
} from "./types";

type OmitKeys = "output";

export type InputText<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> = Omit<Components.InputText<TId, TRequired>, OmitKeys>;

export type InputEmail<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> = Omit<Components.InputEmail<TId, TRequired>, OmitKeys>;

export type InputUrl<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> = Omit<Components.InputUrl<TId, TRequired>, OmitKeys>;

export type InputNumber<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> = Omit<Components.InputNumber<TId, TRequired>, OmitKeys>;

export type InputPassword<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> = Omit<Components.InputPassword<TId, TRequired>, OmitKeys>;

export type InputRadioGroup<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
  TOptions extends SelectOption.List = SelectOption.List,
> = Omit<Components.InputRadioGroup<TId, TRequired, TOptions>, OmitKeys>;

export type InputSelectDropdown<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
  TOptions extends SelectOption.List = SelectOption.List,
> = Omit<Components.InputSelectDropdown<TId, TRequired, TOptions>, OmitKeys>;

export type InputMultiSelectDropdown<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
  TOptions extends SelectOption.List = SelectOption.List,
> = Omit<
  Components.InputMultiSelectDropdown<TId, TRequired, TOptions>,
  OmitKeys
>;

export type InputTable<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> = Omit<Components.InputTable<TId, TRequired>, OmitKeys>;

export type InputFileDrop<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> = Omit<Components.InputFileDrop<TId, TRequired>, OmitKeys>;

export type InputDate<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> = Omit<Components.InputDate<TId, TRequired>, OmitKeys>;

export type InputTime<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> = Omit<Components.InputTime<TId, TRequired>, OmitKeys>;

export type InputDateTime<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> = Omit<Components.InputDateTime<TId, TRequired>, OmitKeys>;

export type InputTextArea<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> = Omit<Components.InputTextArea<TId, TRequired>, OmitKeys>;

export type InputCheckbox<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
> = Omit<Components.InputCheckbox<TId, TRequired>, OmitKeys>;

export type ButtonDefault<TId extends BaseGeneric.Id = BaseGeneric.Id> = Omit<
  Components.ButtonDefault<TId>,
  OmitKeys
>;

export type ButtonFormSubmit<TId extends BaseGeneric.Id = BaseGeneric.Id> =
  Omit<Components.ButtonFormSubmit<TId>, OmitKeys>;

export type ButtonBarChart<TId extends BaseGeneric.Id = BaseGeneric.Id> = Omit<
  Components.ButtonBarChart<TId>,
  OmitKeys
>;

export type ButtonLineChart<TId extends BaseGeneric.Id = BaseGeneric.Id> = Omit<
  Components.ButtonLineChart<TId>,
  OmitKeys
>;

export type DisplayNone<TId extends BaseGeneric.Id = BaseGeneric.Id> = Omit<
  Components.DisplayNone<TId>,
  OmitKeys
>;

export type DisplayText<TId extends BaseGeneric.Id = BaseGeneric.Id> = Omit<
  Components.DisplayText<TId>,
  OmitKeys
>;

export type DisplayHeader<TId extends BaseGeneric.Id = BaseGeneric.Id> = Omit<
  Components.DisplayHeader<TId>,
  OmitKeys
>;

export type DisplayJson<TId extends BaseGeneric.Id = BaseGeneric.Id> = Omit<
  Components.DisplayJson<TId>,
  OmitKeys
>;

export type DisplaySpinner<TId extends BaseGeneric.Id = BaseGeneric.Id> = Omit<
  Components.DisplaySpinner<TId>,
  OmitKeys
>;

export type DisplayCode<TId extends BaseGeneric.Id = BaseGeneric.Id> = Omit<
  Components.DisplayCode<TId>,
  OmitKeys
>;

export type DisplayImage<TId extends BaseGeneric.Id = BaseGeneric.Id> = Omit<
  Components.DisplayImage<TId>,
  OmitKeys
>;

export type DisplayMarkdown<TId extends BaseGeneric.Id = BaseGeneric.Id> = Omit<
  Components.DisplayMarkdown<TId>,
  OmitKeys
>;

export type DisplayPdf<TId extends BaseGeneric.Id = BaseGeneric.Id> = Omit<
  Components.DisplayPdf<TId>,
  OmitKeys
>;

export type LayoutStack<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TChildren extends BaseGeneric.Children = BaseGeneric.Children,
> = Omit<Components.LayoutStack<TId, TChildren>, OmitKeys>;

export type LayoutForm<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TChildren extends BaseGeneric.Children = BaseGeneric.Children,
> = Omit<Components.LayoutForm<TId, TChildren>, OmitKeys>;

export type PageConfirm<TId extends BaseGeneric.Id = BaseGeneric.Id> = Omit<
  Components.PageConfirm<TId>,
  OmitKeys
>;

export type All<
  TId extends BaseGeneric.Id = BaseGeneric.Id,
  TRequired extends BaseGeneric.Required = BaseGeneric.Required,
  TChildren extends All | readonly All[] =
    | All<BaseGeneric.Id, BaseGeneric.Required, any, SelectOption.List>
    | readonly All<
        BaseGeneric.Id,
        BaseGeneric.Required,
        any,
        SelectOption.List
      >[],
  TOptions extends SelectOption.List = SelectOption.List,
> = OmitUnion<Components.All<TId, TRequired, TChildren, TOptions>, OmitKeys>;

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
