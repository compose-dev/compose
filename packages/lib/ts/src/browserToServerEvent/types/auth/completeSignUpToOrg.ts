import * as authUtils from "./utils";

export type ErrorCode = authUtils.SignUpErrorCode;

export type RequestBody = {
  firstName: string;
  lastName: string;
  inviteCode: string;
};

export interface SuccessResponseBody {
  isFirstDeveloperInOrganization: boolean;
}

export interface ErrorResponseBody {
  message: string;
  internalCode: authUtils.SignUpErrorCode;
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;

export const route = "api/v1/auth/complete-sign-up-to-org";
