import { useMutation } from "@tanstack/react-query";
import { BrowserToServerEvent, request } from "@compose/ts";
import { logIfDevelopment } from "../nodeEnvironment";

function useDeleteReportMutation({
  onSuccess,
  onError,
}: {
  onSuccess: (
    data: BrowserToServerEvent.DeleteReport.SuccessResponseBody
  ) => void;
  onError: (error: Error) => void;
}) {
  return useMutation({
    mutationFn: async (reportId: string) => {
      const response = await request<
        BrowserToServerEvent.DeleteReport.SuccessResponseBody,
        BrowserToServerEvent.DeleteReport.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.DeleteReport.route}`,
        method: BrowserToServerEvent.DeleteReport.method,
        body: {},
        params: {
          reportId,
        },
        forwardLog: logIfDevelopment,
      });

      if (response.didError) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
    onSuccess,
    onError,
  });
}

export { useDeleteReportMutation };
