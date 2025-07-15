import { Log } from "../../../models";

export type RequestBody = {};

export interface SuccessResponseBody {
  distinctLogMessages: {
    message: Log.DB["message"];
    type: Log.DB["type"];
  }[];
}

export interface ErrorResponseBody {
  message: string;
  type: "invalid-plan" | "unknown-error" | "invalid-user-permission";
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;

export const route = "api/v1/audit-log/get-distinct-messages";
export const method = "POST";
