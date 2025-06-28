import * as m from "../../../models";

export const route = "api/v1/user/update-metadata";

export const method = "POST";

export type RequestBody = {
  metadata: m.User.Metadata;
};

export interface SuccessResponseBody {
  user: m.User.DB;
}

export interface ErrorResponseBody {
  message: string;
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;
