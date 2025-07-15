import {
  BrowserToServerEvent,
  log as logFunction,
  m,
  request,
} from "@compose/ts";
import { useQuery } from "@tanstack/react-query";
import { getNodeEnvironment } from "../nodeEnvironment";

const isDev = getNodeEnvironment() === "development";
const log = isDev ? logFunction : null;

export function useCustomLogEventsQuery(
  datetimeStart: Date,
  datetimeEnd: Date,
  includeDevLogs: boolean,
  includeProdLogs: boolean,
  selectedApps: { route: string; environmentId: string }[],
  trackedEvents: { message: string; type: m.Log.DB["type"] }[]
) {
  const query = useQuery({
    queryKey: [
      "custom-log-events",
      includeDevLogs,
      includeProdLogs,
      selectedApps,
      trackedEvents,
      datetimeStart,
      datetimeEnd,
    ],
    queryFn: async () => {
      const response = await request<
        BrowserToServerEvent.GetCustomLogEvents.SuccessResponseBody,
        BrowserToServerEvent.GetCustomLogEvents.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.GetCustomLogEvents.route}`,
        method: BrowserToServerEvent.GetCustomLogEvents.method,
        body: {
          datetimeStart,
          datetimeEnd,
          includeDevelopmentLogs: includeDevLogs,
          includeProductionLogs: includeProdLogs,
          apps: selectedApps,
          trackedEvents,
        },
        forwardLog: log,
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
