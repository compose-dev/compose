import { Environment } from "../../../models";

export const route = "api/v1/environment/:environmentId/refresh-api-key";

export const method = "POST";

export interface SuccessResponseBody {
  environment: Environment.ApiAndDecryptableKeyOmittedDB & {
    key: string;
  };
}

export interface ErrorResponseBody {
  message: string;
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;
