import { Environment } from "../../../models";

export const route = "api/v1/environment";

export const method = "GET";

export interface SuccessResponseBody {
  environments: Environment.ApiAndDecryptableKeyOmittedDB[];
}

export interface ErrorResponseBody {
  message: string;
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;
