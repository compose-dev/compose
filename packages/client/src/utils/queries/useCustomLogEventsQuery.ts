import { BrowserToServerEvent, m, request } from "@compose/ts";
import { useQuery } from "@tanstack/react-query";
import { logIfDevelopment } from "../nodeEnvironment";

export function useCustomLogEventsQuery(
  timeFrame: m.Report.Timeframe,
  dateRange: m.Report.DB["data"]["dateRange"],
  includeDevLogs: boolean,
  includeProdLogs: boolean,
  selectedApps: m.Report.DB["data"]["selectedApps"],
  trackedEventModel: m.Report.DB["data"]["trackedEventModel"],
  reportId: string | undefined
) {
  const query = useQuery({
    queryKey: [
      "custom-log-events",
      includeDevLogs,
      includeProdLogs,
      selectedApps,
      trackedEventModel,
      timeFrame,
      dateRange,
      reportId,
    ],
    queryFn: async () => {
      const response = await request<
        BrowserToServerEvent.GetCustomLogEvents.SuccessResponseBody,
        BrowserToServerEvent.GetCustomLogEvents.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.GetCustomLogEvents.route}`,
        method: BrowserToServerEvent.GetCustomLogEvents.method,
        body: {
          timeFrame,
          dateRange,
          includeDevelopmentLogs: includeDevLogs,
          includeProductionLogs: includeProdLogs,
          apps: selectedApps,
          trackedEventModel,
          reportId,
        },
        forwardLog: logIfDevelopment,
      });

      if (response.didError) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
    retry: false,
    // Retain the previous data when the query is refetched to avoid flickering.
    placeholderData: (prev) => prev,
    staleTime: 15 * 1000, // 15 seconds
  });

  return query;
}
