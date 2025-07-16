import { BrowserToServerEvent, log as logFunction, request } from "@compose/ts";
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

      return response.data;
    },
    retry: false, // never auto-retry
  });
}
