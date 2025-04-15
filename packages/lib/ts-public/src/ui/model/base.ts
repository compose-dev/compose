import { Style, LayoutAppearance, BaseGeneric } from "../types";

interface Base<TId extends BaseGeneric.Id> {
  id: TId;
  properties: Record<
    string,
    string | number | null | object | boolean | undefined
  >;
}

export interface BaseWithInputInteraction<
  TId extends BaseGeneric.Id,
  TRequired extends BaseGeneric.Required,
> extends Base<TId> {
  style: Style;
  label: string | null;
  description: string | null;
  required: TRequired;
  hasValidateHook: boolean;
}

export interface BaseWithButtonInteraction<TId extends BaseGeneric.Id>
  extends Base<TId> {
  style: Style;
}

export interface BaseWithDisplayInteraction<TId extends BaseGeneric.Id>
  extends Base<TId> {
  style: Style;
}

export interface BaseWithLayoutInteraction<
  TId extends BaseGeneric.Id,
  TChildren extends BaseGeneric.Children,
> extends Base<TId> {
  style: Style;
  children: TChildren;
  direction:
    | "vertical"
    | "vertical-reverse"
    | "horizontal"
    | "horizontal-reverse";
  justify: "start" | "end" | "center" | "between" | "around" | "evenly";
  align: "start" | "end" | "center" | "baseline" | "stretch";
  spacing:
    | "0px"
    | "2px"
    | "4px"
    | "8px"
    | "12px"
    | "16px"
    | "20px"
    | "24px"
    | "28px"
    | "32px"
    | "40px"
    | "48px"
    | "56px"
    | "64px"
    | "72px"
    | "80px"
    | "88px"
    | "96px"
    | "104px"
    | "112px"
    | "120px"
    | "128px"
    | "136px"
    | "144px"
    | "152px"
    | "160px"
    | (`${number}px` & {});
  appearance?: LayoutAppearance.Type;
  responsive?: boolean;
}

export interface BaseWithPageInteraction<TId extends BaseGeneric.Id>
  extends Base<TId> {}
