import * as m from "../../../models";

export const route = "api/v1/environment/:environmentId/details";

export const method = "GET";

export type RequestBody = null;

export type Response = {
  environment: m.Environment.ApiAndDecryptableKeyOmittedDB & {
    externalAppUsers: m.ExternalAppUser.DB[];
  };
};

export type ErrorData = {
  message: string;
};
