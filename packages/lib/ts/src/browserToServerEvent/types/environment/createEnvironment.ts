import * as m from "../../../models";

export const route = "api/v1/environment";

export const method = "POST";

export type RequestBody = {
  name: string;
  type: m.Environment.Type;
};

export type Response = m.Environment.ApiAndDecryptableKeyOmittedDB & {
  key: string;
};

export type ErrorData = {
  message: string;
};
