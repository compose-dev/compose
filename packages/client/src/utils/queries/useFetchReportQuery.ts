import {
  BrowserToServerEvent,
  log as logFunction,
  request,
  u,
} from "@compose/ts";
import { useQuery } from "@tanstack/react-query";
import { getNodeEnvironment } from "~/utils/nodeEnvironment";

const isDev = getNodeEnvironment() === "development";
const log = isDev ? logFunction : null;

export function useFetchReportQuery(reportId: string | undefined) {
  return useQuery({
    queryKey: ["report", reportId],
    queryFn: async () => {
      if (!reportId) {
        throw new Error("Report ID is required");
      }

      const response = await request<
        BrowserToServerEvent.GetReport.SuccessResponseBody,
        BrowserToServerEvent.GetReport.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.GetReport.route}`,
        method: BrowserToServerEvent.GetReport.method,
        params: {
          reportId,
        },
        forwardLog: log,
      });

      if (response.didError) {
        throw new Error(response.data.message);
      }

      const report = response.data.report;

      // Deserialize dates
      const result = {
        ...response.data,
        report: {
          ...report,
          createdAt: u.date.deserialize(report.createdAt),
          updatedAt: u.date.deserialize(report.updatedAt),
          data: {
            ...report.data,
            dateRange: {
              start: u.date.deserialize(report.data.dateRange.start),
              end: u.date.deserialize(report.data.dateRange.end),
            },
          },
        },
      };

      return result;
    },
    retry: false, // never auto-retry
  });
}
