import { Log } from "../../../models";

export type RequestBody = {
  limit: number;
  offset: number;
  appRoute: string | null;
  userEmail: string | null;
  severity: Log.DB["severity"][] | null;
  type: Log.DB["type"] | null;
  datetimeStart: Date | null;
  datetimeEnd: Date | null;
  message: string | null;
};

export interface SuccessResponseBody {
  logs: Omit<Log.DB, "companyId" | "id">[];
  totalRecords: number;
}

export interface ErrorResponseBody {
  message: string;
  type: "invalid-plan" | "unknown-error" | "invalid-user-permission";
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;

export const route = "api/v1/audit-log/get-page";
export const method = "POST";
