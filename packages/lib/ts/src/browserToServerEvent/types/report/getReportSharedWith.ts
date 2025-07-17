import * as m from "../../../models";

export const route = "api/v1/report/:reportId/share";

export const method = "GET";

export interface RequestParams {
  reportId: m.Report.DB["id"];
}

export interface SuccessResponseBody {
  reportUsers: m.ReportUser.DB[];
}

export interface ErrorResponseBody {
  message: string;
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;
