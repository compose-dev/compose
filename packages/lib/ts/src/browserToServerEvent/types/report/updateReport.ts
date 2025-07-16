import * as m from "../../../models";

export const route = "api/v1/report/:reportId";

export const method = "PUT";

export interface RequestParams {
  reportId: m.Report.DB["id"];
}

export type RequestBody = {
  title: m.Report.DB["title"];
  description: m.Report.DB["description"];
  data: m.Report.DB["data"];
};

export interface SuccessResponseBody {
  report: m.Report.DB;
}

export interface ErrorResponseBody {
  message: string;
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;
