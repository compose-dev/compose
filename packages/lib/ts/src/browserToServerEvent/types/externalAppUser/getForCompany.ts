import * as m from "../../../models";

export const route = "api/v1/external-app-user/:id";

export const method = "GET";

export type Response = m.ExternalAppUser.DB[];

export type ErrorData = {
  message: string;
};
