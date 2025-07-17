import { BrowserToServerEvent, request } from "@compose/ts";
import { useQuery } from "@tanstack/react-query";
import { logIfDevelopment } from "../nodeEnvironment";

export function useDistinctLogMessagesQuery() {
  const query = useQuery({
    queryKey: ["distinct-log-messages"],
    queryFn: async () => {
      const response = await request<
        BrowserToServerEvent.GetDistinctLogMessages.SuccessResponseBody,
        BrowserToServerEvent.GetDistinctLogMessages.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.GetDistinctLogMessages.route}`,
        method: BrowserToServerEvent.GetDistinctLogMessages.method,
        body: {},
        forwardLog: logIfDevelopment,
      });

      if (response.didError) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
    retry: false,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });

  return query;
}
