import { BaseWithLayoutInteraction } from "./base";
import { BaseGeneric } from "../types";

export interface Stack<
  TId extends BaseGeneric.Id,
  TChildren extends BaseGeneric.Children,
> extends BaseWithLayoutInteraction<TId, TChildren> {
  properties: {};
}

export interface Form<
  TId extends BaseGeneric.Id,
  TChildren extends BaseGeneric.Children,
> extends BaseWithLayoutInteraction<TId, TChildren> {
  properties: {
    hasOnSubmitHook: boolean;
    hasValidateHook: boolean;
    clearOnSubmit: boolean;
    hideSubmitButton?: boolean;
  };
}
