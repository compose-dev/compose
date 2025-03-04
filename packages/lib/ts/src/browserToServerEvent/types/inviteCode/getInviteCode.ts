import * as m from "../../../models";

export const route = "api/v1/invite-code/:id";

export const method = "GET";

export type RequestBody = null;
export type Response = m.EmailCode.WithCompany;

export type ErrorData = {
  message: string;
};
