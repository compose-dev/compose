export * from "./interactionType";
export * from "./type";
export * from "./validatorResponse";
export * as SelectOption from "./selectOption";
export * as ButtonAppearance from "./buttonAppearance";
export * from "./style";
export * as Table from "./table";
export * as CodeLanguage from "./codeLanguage";
export * as LayoutAppearance from "./layoutAppearance";
export * from "./annotation";
export * from "./renderAppearance";
export * from "./modalWidth";
export * as Appearance from "./appearance";
export * as Size from "./size";
export * as DateTime from "./datetime";
export * as Stale from "./stale";
export * as ComposeFile from "./composeFile";
export * as Chart from "./chart";
export * as Factory from "./factory";
export * as BaseInputValue from "./baseInputValue";
export * as BaseGeneric from "./baseGeneric";
export * as NumberFormat from "./numberFormat";

export type OmitUnion<T, K extends keyof T> = T extends any
  ? Omit<T, K>
  : never;

export type PickUnion<T, K extends keyof T> = T extends any
  ? Pick<T, K>
  : never;
