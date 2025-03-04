import * as m from "../../../models";

export const route = "api/v1/user/dev-environment";

export const method = "GET";

export type RequestBody = null;

export type Response = {
  // This is a list since we may eventually want to support multiple dev
  // environments per user.
  environments: m.Environment.ApiKeyOmittedDB[];
};

export type ErrorData = {
  message: string;
};
