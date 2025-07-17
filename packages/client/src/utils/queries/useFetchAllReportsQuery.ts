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

export function useFetchAllReportsQuery() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await request<
        BrowserToServerEvent.GetReports.SuccessResponseBody,
        BrowserToServerEvent.GetReports.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.GetReports.route}`,
        method: BrowserToServerEvent.GetReports.method,
        forwardLog: log,
      });

      if (response.didError) {
        throw new Error(response.data.message);
      }

      return {
        ...response.data,
        reports: response.data.reports.map((report) => ({
          ...report,
          createdAt: u.date.deserialize(report.createdAt),
          updatedAt: u.date.deserialize(report.updatedAt),
        })),
      };
    },
    retry: false, // never auto-retry
    initialData: {
      reports: [],
    },
  });
}
