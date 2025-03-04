import { ValidatorResponse } from "../validatorResponse";

export type Nullable<TValue> = TValue | null;

export type ValidatorCallback<TVal> = (value: TVal) => ValidatorResponse;

export type NullableValidatorCallback<TVal, TRequired> = (
  value: TRequired extends true ? TVal : TVal | null
) => ValidatorResponse;

export type InputValueCallback<TVal> = (value: TVal) => void;

export type NullableInputValueCallback<TVal, TRequired> = (
  value: TRequired extends true ? TVal : TVal | null
) => void;
