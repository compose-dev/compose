import { Log, Report } from "../../../models";

export type RequestBody = {
  timeFrame: Report.Timeframe;
  dateRange: Report.DB["data"]["dateRange"];
  includeDevelopmentLogs: boolean;
  includeProductionLogs: boolean;
  // Filter by apps. If empty, all apps are included.
  apps: Report.DB["data"]["selectedApps"];
  trackedEventModel: Report.DB["data"]["trackedEventModel"];
  reportId: string | undefined;
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
