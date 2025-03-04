import * as m from "../../../models";

export const route = "api/v1/user/:userId";

export const method = "DELETE";

export type RequestBody = null;

export type Response = {};

export type ErrorData = {
  message: string;
};
