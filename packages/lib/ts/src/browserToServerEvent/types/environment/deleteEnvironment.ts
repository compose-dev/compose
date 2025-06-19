export const route = "api/v1/environment/:environmentId";

export const method = "DELETE";

export interface SuccessResponseBody {
  success: true;
}

export interface ErrorResponseBody {
  message: string;
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;
