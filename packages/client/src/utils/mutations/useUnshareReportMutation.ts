import { useMutation } from "@tanstack/react-query";
import { BrowserToServerEvent, request } from "@compose/ts";
import { logIfDevelopment } from "../nodeEnvironment";

function useUnshareReportMutation({
  onSuccess,
}: {
  onSuccess: (
    data: BrowserToServerEvent.UnshareReport.SuccessResponseBody
  ) => void;
}) {
  return useMutation({
    mutationFn: async (
      params: BrowserToServerEvent.UnshareReport.RequestParams
    ) => {
      const response = await request<
        BrowserToServerEvent.UnshareReport.SuccessResponseBody,
        BrowserToServerEvent.UnshareReport.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.UnshareReport.route}`,
        method: BrowserToServerEvent.UnshareReport.method,
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

export { useUnshareReportMutation };
