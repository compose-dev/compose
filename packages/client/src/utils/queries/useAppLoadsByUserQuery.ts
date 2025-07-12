import { BrowserToServerEvent, log as logFunction, request } from "@compose/ts";
import { useQuery } from "@tanstack/react-query";
import { getNodeEnvironment } from "../nodeEnvironment";
import { useEffect, useRef } from "react";

const isDev = getNodeEnvironment() === "development";
const log = isDev ? logFunction : null;

export function useAppLoadsByUserQuery(
  datetimeStart: Date,
  datetimeEnd: Date,
  includeDevLogs: boolean,
  includeProdLogs: boolean,
  selectedApps: { route: string; environmentId: string }[]
) {
  const prevDatetimeStart = useRef(datetimeStart);
  const prevDatetimeEnd = useRef(datetimeEnd);
  const prevIncludeDevLogs = useRef(includeDevLogs);
  const prevIncludeProdLogs = useRef(includeProdLogs);
  const prevSelectedApps = useRef(selectedApps);

  const query = useQuery({
    queryKey: ["app-loads-by-user"],
    queryFn: async () => {
      const response = await request<
        BrowserToServerEvent.GetAppLoadsByUser.SuccessResponseBody,
        BrowserToServerEvent.GetAppLoadsByUser.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.GetAppLoadsByUser.route}`,
        method: BrowserToServerEvent.GetAppLoadsByUser.method,
        body: {
          datetimeStart,
          datetimeEnd,
          includeDevelopmentLogs: includeDevLogs,
          includeProductionLogs: includeProdLogs,
          apps: selectedApps,
        },
        forwardLog: log,
      });

      if (response.didError) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (
      datetimeStart !== prevDatetimeStart.current ||
      datetimeEnd !== prevDatetimeEnd.current ||
      includeDevLogs !== prevIncludeDevLogs.current ||
      includeProdLogs !== prevIncludeProdLogs.current ||
      JSON.stringify(selectedApps) !== JSON.stringify(prevSelectedApps.current)
    ) {
      prevDatetimeStart.current = datetimeStart;
      prevDatetimeEnd.current = datetimeEnd;
      prevIncludeDevLogs.current = includeDevLogs;
      prevIncludeProdLogs.current = includeProdLogs;
      prevSelectedApps.current = selectedApps;

      query.refetch();
    }
  }, [
    datetimeStart,
    datetimeEnd,
    includeDevLogs,
    includeProdLogs,
    query,
    selectedApps,
  ]);

  return query;
}
