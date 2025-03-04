import * as authUtils from "./utils";

export type ErrorCode = authUtils.SignUpErrorCode;

export type RequestBody = {
  firstName: string;
  lastName: string;
  inviteCode: string;
};

export type ErrorData = {
  message: string;
  internalCode: authUtils.SignUpErrorCode;
};

export type ResponseBody = {
  success: true;
};

export const route = "api/v1/auth/complete-sign-up-to-org";
