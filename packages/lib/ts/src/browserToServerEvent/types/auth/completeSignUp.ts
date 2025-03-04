import * as m from "../../../models";
import * as authUtils from "./utils";

export type RequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  accountType: m.User.AccountType;
  orgName: string;
};

export type ErrorData = {
  message: string;
  internalCode: authUtils.SignUpErrorCode;
};

export type ResponseBody = {
  success: true;
};

export const route = "api/v1/auth/complete-sign-up";
