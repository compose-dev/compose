export type ValidatorSuccessResponseType = true | undefined | void;
export type ValidatorErrorResponseType = string;

export type StaticValidatorResponse =
  | ValidatorSuccessResponseType
  | ValidatorErrorResponseType;

export type ValidatorResponse =
  | Promise<StaticValidatorResponse>
  | StaticValidatorResponse;
