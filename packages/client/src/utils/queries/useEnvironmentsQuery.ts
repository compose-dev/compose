import { BrowserToServerEvent, log as logFunction, request } from "@compose/ts";
import { useQuery } from "@tanstack/react-query";
import { getNodeEnvironment } from "../nodeEnvironment";

const isDev = getNodeEnvironment() === "development";
const log = isDev ? logFunction : null;

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
        forwardLog: log,
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
