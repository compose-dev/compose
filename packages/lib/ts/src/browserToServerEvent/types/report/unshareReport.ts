import * as m from "../../../models";

export const route = "api/v1/report/:reportId/share/:userId";

export const method = "DELETE";

export interface RequestParams {
  reportId: m.Report.DB["id"];
  userId: m.User.DB["id"];
}

export interface SuccessResponseBody {
  success: true;
}

export interface ErrorResponseBody {
  message: string;
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;
