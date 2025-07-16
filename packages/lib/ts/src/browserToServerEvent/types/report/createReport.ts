import * as m from "../../../models";

export const route = "api/v1/report";

export const method = "POST";

export type RequestBody = {
  title: m.Report.DB["title"];
  description: m.Report.DB["description"];
  data: m.Report.DB["data"];
};

export interface SuccessResponseBody {
  reportId: m.Report.DB["id"];
}

export interface ErrorResponseBody {
  message: string;
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;
