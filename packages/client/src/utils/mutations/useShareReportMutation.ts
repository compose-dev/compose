import { useMutation } from "@tanstack/react-query";
import { BrowserToServerEvent, log as logFunction, request } from "@compose/ts";
import { getNodeEnvironment } from "../nodeEnvironment";

const isDev = getNodeEnvironment() === "development";
const log = isDev ? logFunction : null;

function useShareReportMutation({
  onSuccess,
}: {
  onSuccess: (
    data: BrowserToServerEvent.ShareReport.SuccessResponseBody
  ) => void;
}) {
  return useMutation({
    mutationFn: async (
      params: BrowserToServerEvent.ShareReport.RequestParams
    ) => {
      const response = await request<
        BrowserToServerEvent.ShareReport.SuccessResponseBody,
        BrowserToServerEvent.ShareReport.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.ShareReport.route}`,
        method: BrowserToServerEvent.ShareReport.method,
        params: { ...params },
        body: {},
        forwardLog: log,
      });

      if (response.didError) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
    onSuccess,
  });
}

export { useShareReportMutation };
