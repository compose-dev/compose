import { useMutation } from "@tanstack/react-query";
import { BrowserToServerEvent, log as logFunction, request } from "@compose/ts";
import { getNodeEnvironment } from "../nodeEnvironment";

const isDev = getNodeEnvironment() === "development";
const log = isDev ? logFunction : null;

function useCreateReportMutation({
  onSuccess,
}: {
  onSuccess: (
    data: BrowserToServerEvent.CreateReport.SuccessResponseBody
  ) => void;
}) {
  return useMutation({
    mutationFn: async (body: BrowserToServerEvent.CreateReport.RequestBody) => {
      const response = await request<
        BrowserToServerEvent.CreateReport.SuccessResponseBody,
        BrowserToServerEvent.CreateReport.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.CreateReport.route}`,
        method: BrowserToServerEvent.CreateReport.method,
        body,
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

export { useCreateReportMutation };
