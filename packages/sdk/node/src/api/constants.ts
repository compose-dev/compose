import { ServerToSdkEvent, WSUtils } from "@composehq/ts-public";

export const WS_CLIENT = {
  URL: {
    DEV: `ws://localhost:8080/${WSUtils.Routes.SDK_TO_SERVER_PATH}`,
    PROD: `wss://app.composehq.com/${WSUtils.Routes.SDK_TO_SERVER_PATH}`,
    CUSTOM: (host: string) =>
      `wss://${host}/${WSUtils.Routes.SDK_TO_SERVER_PATH}`,
  },
  RECONNECTION_INTERVAL: {
    BASE_IN_SECONDS: 5,
    BACKOFF_MULTIPLIER: 1.7,
    MAX_IN_SECONDS: 60 * 60 * 6, // 6 hours
  },
  CONNECTION_HEADERS: {
    API_KEY: "x-compose-api-key",
    PACKAGE_NAME: "x-compose-package-name",
    PACKAGE_VERSION: "x-compose-package-version",
  },
  ERROR_RESPONSE_HEADERS: {
    REASON: "x-compose-error-reason",
    CODE: "x-compose-error-code",
  },
} as const;

export const WS_SERVER = {
  DEFAULT_PORT: 8484,
} as const;

export type ListenerEvent =
  | ServerToSdkEvent.Data
  | {
      type: typeof ServerToSdkEvent.TYPE.FILE_TRANSFER;
      executionId: string;
      fileId: string;
      fileContents: ArrayBuffer;
    };
