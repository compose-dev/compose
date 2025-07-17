import { useMutation } from "@tanstack/react-query";
import { BrowserToServerEvent, log as logFunction, request } from "@compose/ts";
import { getNodeEnvironment } from "../nodeEnvironment";

const isDev = getNodeEnvironment() === "development";
const log = isDev ? logFunction : null;

function useUpdateReportMutation({
  onSuccess,
}: {
  onSuccess: (
    data: BrowserToServerEvent.UpdateReport.SuccessResponseBody
  ) => void;
}) {
  return useMutation({
    mutationFn: async ({
      body,
      params,
    }: {
      body: BrowserToServerEvent.UpdateReport.RequestBody;
      params: BrowserToServerEvent.UpdateReport.RequestParams;
    }) => {
      const response = await request<
        BrowserToServerEvent.UpdateReport.SuccessResponseBody,
        BrowserToServerEvent.UpdateReport.ErrorResponseBody
      >({
        route: `/${BrowserToServerEvent.UpdateReport.route}`,
        method: BrowserToServerEvent.UpdateReport.method,
        params: {
          ...params,
        },
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

export { useUpdateReportMutation };
