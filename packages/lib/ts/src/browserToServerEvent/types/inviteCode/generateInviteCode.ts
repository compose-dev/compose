import * as m from "../../../models";

export const route = "api/v1/invite-code";

export const method = "POST";

export type RequestBody = {
  email: string;
  accountType: m.User.AccountType;
  permission: m.User.Permission;
};

export type Response = m.EmailCode.DB;

export type ErrorData = {
  message: string;
};
