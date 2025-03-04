import {
  ServerToBrowserEvent,
  WSUtils,
  u as uPublic,
} from "@composehq/ts-public";

function generateConnectionStatusMessage(
  browserSessionId: string,
  environmentId: string,
  isOnline: boolean,
  packageName: uPublic.sdkPackage.Name | undefined,
  packageVersion: string | undefined,
  message?: string
) {
  const event: ServerToBrowserEvent.ConnectionStatus.Data = {
    type: ServerToBrowserEvent.TYPE.SDK_CONNECTION_STATUS_CHANGED,
    environmentId,
    isOnline,
    message:
      message ??
      (isOnline ? "Connection is active." : "Connection is inactive."),
    packageName,
    packageVersion,
  };

  return Buffer.from(
    WSUtils.Message.generateBinary(
      `${ServerToBrowserEvent.TYPE.SDK_CONNECTION_STATUS_CHANGED}${browserSessionId}`,
      WSUtils.Message.getBufferFromJson(event)
    )
  );
}

export { generateConnectionStatusMessage };
