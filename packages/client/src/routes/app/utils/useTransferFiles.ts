import { BrowserToServerEvent } from "@compose/ts";
import { UI, WSUtils } from "@composehq/ts-public";
import { useCallback } from "react";
import { appStore } from "~/utils/appStore";
import { useWSContext } from "~/utils/wsContext";

function useTransferFiles(
  environmentId: string | null,
  executionId: string | null
) {
  const { sendWSRawMessage } = useWSContext();

  const transferFiles = useCallback(
    async (
      inputComponent: Extract<
        appStore.FrontendComponentOutput.All,
        { type: typeof UI.TYPE.INPUT_FILE_DROP }
      >
    ) => {
      if (!environmentId || !executionId) {
        return;
      }

      for (
        let idx = 0;
        idx < inputComponent.output.networkTransferValue.length;
        idx++
      ) {
        const file = inputComponent.output.internalValue[idx];
        const fileId = inputComponent.output.networkTransferValue[idx].fileId;

        const headerString =
          BrowserToServerEvent.WS.TYPE.FILE_TRANSFER +
          environmentId +
          executionId +
          fileId;

        const buffer = WSUtils.Message.generateBinary(
          headerString,
          new Uint8Array(await file.arrayBuffer())
        );

        sendWSRawMessage(buffer, environmentId);
      }
    },
    [environmentId, executionId, sendWSRawMessage]
  );

  return { transferFiles };
}

export { useTransferFiles };
