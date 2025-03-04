import { m } from "../../..";

export const route = "api/v1/external-app-user-for-app";

export const method = "POST";

export type RequestBody = {
  appRoute: string;
  environmentId: string;
};

export type Response = m.ExternalAppUser.DB[];

export type ErrorData = {
  message: string;
};
