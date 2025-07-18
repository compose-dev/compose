import { BrowserToServerEvent, request } from "@compose/ts";
import { useQuery } from "@tanstack/react-query";
import { logIfDevelopment } from "../nodeEnvironment";

export function useEnvironmentsQuery() {
  const query = useQuery({
    queryKey: ["environments"],
    queryFn: async () => {
      const response = await request<
        BrowserToServerEvent.FetchEnvironments.SuccessResponseBody,
        BrowserToServerEvent.FetchEnvironments.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.FetchEnvironments.route}`,
        method: BrowserToServerEvent.FetchEnvironments.method,
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
