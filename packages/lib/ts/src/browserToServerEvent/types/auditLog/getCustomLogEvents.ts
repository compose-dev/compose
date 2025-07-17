import { Log, Report } from "../../../models";

export type RequestBody = {
  timeFrame: Report.DB["data"]["timeFrame"];
  dateRange: Report.DB["data"]["dateRange"];
  includeDevelopmentLogs: Report.DB["data"]["includeDevelopmentLogs"];
  includeProductionLogs: Report.DB["data"]["includeProductionLogs"];
  apps: Report.DB["data"]["selectedApps"];
  trackedEventModel: Report.DB["data"]["trackedEventModel"];
  selectedUserEmails: Report.DB["data"]["selectedUserEmails"];
  includeAnonymousUsers: Report.DB["data"]["includeAnonymousUsers"];
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
