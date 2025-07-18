import { useMutation } from "@tanstack/react-query";
import { BrowserToServerEvent, request } from "@compose/ts";
import { logIfDevelopment } from "../nodeEnvironment";

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
        forwardLog: logIfDevelopment,
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
