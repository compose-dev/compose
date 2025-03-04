export type RequestBody = {
  newAccount: boolean;
  environmentId: string | null;
  appRoute: string | null;
};

export enum ErrorCode {
  USER_NOT_FOUND = "0a",
  UNKNOWN_ERROR = "0b",
}

export type ErrorData = {
  message: string;
  internalCode: ErrorCode;
};

export const RESPONSE_TYPE = {
  EXISTING_USER: "existing-user",
  NEW_USER: "new-user",
} as const;

export type ResponseBody =
  | {
      type: typeof RESPONSE_TYPE.EXISTING_USER;
    }
  | {
      type: typeof RESPONSE_TYPE.NEW_USER;
      firstName: string | null;
      lastName: string | null;
      email: string;
    };

export const route = "api/v1/auth/google-oauth/redirect";
