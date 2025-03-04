import * as m from "../../models";

export const route = "api/v1/settings";

export const method = "GET";

export type RequestBody = null;

export type Response = {
  users: m.User.DB[];
  pendingInvites: m.EmailCode.DB[];
  company: m.Company.DB;
};

export type ErrorData = {
  message: string;
};
