import * as m from "../../../models";

export const route = "api/v1/report";

export const method = "GET";

export interface SuccessResponseBody {
  reports: m.Report.DB[];
}

export interface ErrorResponseBody {
  message: string;
}

export type ResponseBody = SuccessResponseBody | ErrorResponseBody;
