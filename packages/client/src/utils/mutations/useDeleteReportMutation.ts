import { useMutation } from "@tanstack/react-query";
import { BrowserToServerEvent, log as logFunction, request } from "@compose/ts";
import { getNodeEnvironment } from "../nodeEnvironment";

const isDev = getNodeEnvironment() === "development";
const log = isDev ? logFunction : null;

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
        forwardLog: log,
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
