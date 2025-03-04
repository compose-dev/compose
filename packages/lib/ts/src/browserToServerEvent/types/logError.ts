import { ErrorLog } from "../../models";

export const route = "api/v1/log-error";

export const method = "POST";

export type RequestBody = ErrorLog.DB["data"];

export type SuccessResponseBody = {
  success: true;
};

export type ErrorResponseBody = {
  message: string;
};

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;
