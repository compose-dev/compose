import { BrowserToServerEvent, request, u } from "@compose/ts";
import { useQuery } from "@tanstack/react-query";
import { logIfDevelopment } from "~/utils/nodeEnvironment";

export function useFetchReportSharedWithQuery(reportId: string | undefined) {
  return useQuery({
    queryKey: ["report-shared-with", reportId],
    queryFn: async () => {
      if (!reportId) {
        throw new Error("Report ID is required");
      }

      const response = await request<
        BrowserToServerEvent.GetReportSharedWith.SuccessResponseBody,
        BrowserToServerEvent.GetReportSharedWith.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.GetReportSharedWith.route}`,
        method: BrowserToServerEvent.GetReportSharedWith.method,
        params: {
          reportId,
        },
        forwardLog: logIfDevelopment,
      });

      if (response.didError) {
        throw new Error(response.data.message);
      }

      const reportUsers = response.data.reportUsers;

      return {
        ...response.data,
        reportUsers: reportUsers.map((reportUser) => ({
          ...reportUser,
          createdAt: u.date.deserialize(reportUser.createdAt),
        })),
      };
    },
    retry: false, // never auto-retry
  });
}
