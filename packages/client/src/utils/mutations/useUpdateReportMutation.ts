import { useMutation } from "@tanstack/react-query";
import { BrowserToServerEvent, request } from "@compose/ts";
import { logIfDevelopment } from "../nodeEnvironment";

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

export { useUpdateReportMutation };
