import { Log } from "../../../models";

export type RequestBody = {
  datetimeStart: Date;
  datetimeEnd: Date;
  includeDevelopmentLogs: boolean;
  includeProductionLogs: boolean;
  // Filter by apps. If empty, all apps are included.
  apps: {
    route: string;
    environmentId: string;
  }[];
  trackedEvents: {
    message: string;
    type: Log.DB["type"];
  }[];
};

export interface SuccessResponseBody {
  groupedLogs: {
    userEmail: Log.DB["userEmail"];
    environmentId: Log.DB["environmentId"];
    appRoute: Log.DB["appRoute"];
    count: number;
    message: string;
  }[];
}

export interface ErrorResponseBody {
  message: string;
  type: "invalid-plan" | "unknown-error" | "invalid-user-permission";
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;

export const route = "api/v1/audit-log/get-custom-log-events";
export const method = "POST";
