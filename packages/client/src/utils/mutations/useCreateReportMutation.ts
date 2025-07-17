import { useMutation } from "@tanstack/react-query";
import { BrowserToServerEvent, request } from "@compose/ts";
import { logIfDevelopment } from "../nodeEnvironment";

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

export { useCreateReportMutation };
