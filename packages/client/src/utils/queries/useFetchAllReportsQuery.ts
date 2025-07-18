import { BrowserToServerEvent, request, u } from "@compose/ts";
import { useQuery } from "@tanstack/react-query";
import { logIfDevelopment } from "~/utils/nodeEnvironment";

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
        forwardLog: logIfDevelopment,
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
