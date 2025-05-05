import {
  SdkToServerEvent,
  ServerToSdkEvent,
  WSUtils,
} from "@composehq/ts-public";
import { v4 as uuid } from "uuid";
import {
  WebSocket as NodeWebSocket,
  RawData as NodeWebSocketRawData,
} from "ws";
import { WS_CLIENT, type ListenerEvent } from "./constants";

const PING_TIMEOUT_MS = 45000; // 45 seconds

class WSClient {
  private apiKey: string;
  private packageName: string;
  private packageVersion: string;
  private onMessageCallback: (event: ListenerEvent) => void;

  private reconnectionInterval: number;
  private WS_URL: string;
  private shuttingDown: boolean = false;

  private ws: NodeWebSocket | null = null;
  private isConnected: boolean = false;
  private push: (data: ArrayBuffer) => void = () => {};
  private sendQueue: Record<string, ArrayBuffer> = {};

  private pingTimeoutTimer: NodeJS.Timeout | null = null;

  constructor(
    isDevelopment: boolean,
    apiKey: string,
    packageName: string,
    packageVersion: string,
    onMessageCallback: (event: ListenerEvent) => void,
    host: string | undefined
  ) {
    this.apiKey = apiKey;
    this.packageName = packageName;
    this.packageVersion = packageVersion;
    this.onMessageCallback = onMessageCallback;

    this.reconnectionInterval = WS_CLIENT.RECONNECTION_INTERVAL.BASE_IN_SECONDS;
    this.WS_URL = isDevelopment
      ? WS_CLIENT.URL.DEV
      : host
        ? WS_CLIENT.URL.CUSTOM(host)
        : WS_CLIENT.URL.PROD;

    this.connect = this.connect.bind(this);
    this.shutdown = this.shutdown.bind(this);
    this.makeConnectionRequest = this.makeConnectionRequest.bind(this);
    this.resetPingTimer = this.resetPingTimer.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onError = this.onError.bind(this);
    this.onClose = this.onClose.bind(this);
    this.sendRaw = this.sendRaw.bind(this);
    this.send = this.send.bind(this);
    this.flushSendQueue = this.flushSendQueue.bind(this);
  }

  connect() {
    if (this.ws) {
      this.ws.terminate();
      this.ws = null;
    }

    this.makeConnectionRequest();
  }

  shutdown() {
    this.shuttingDown = true;

    if (this.pingTimeoutTimer) {
      clearTimeout(this.pingTimeoutTimer);
      this.pingTimeoutTimer = null;
    }

    if (this.ws !== null) {
      this.ws.close();
    }
  }

  private makeConnectionRequest() {
    this.ws = new NodeWebSocket(this.WS_URL, {
      rejectUnauthorized: true,
      headers: {
        [WS_CLIENT.CONNECTION_HEADERS.API_KEY]: this.apiKey,
        [WS_CLIENT.CONNECTION_HEADERS.PACKAGE_NAME]: this.packageName,
        [WS_CLIENT.CONNECTION_HEADERS.PACKAGE_VERSION]: this.packageVersion,
      },
    });

    this.ws.on("unexpected-response", (_, res) => {
      if (WS_CLIENT.ERROR_RESPONSE_HEADERS.REASON in res.headers) {
        const errString = decodeURIComponent(
          res.headers[WS_CLIENT.ERROR_RESPONSE_HEADERS.REASON] as string
        );

        const errorCode = res.headers[
          WS_CLIENT.ERROR_RESPONSE_HEADERS.CODE
        ] as string;

        console.warn(`${errString} Error code: ${errorCode}`);

        // Double the reconnection interval after an unexpected response error
        this.reconnectionInterval = Math.ceil(
          this.reconnectionInterval *
            WS_CLIENT.RECONNECTION_INTERVAL.BACKOFF_MULTIPLIER
        );

        this.onClose(1006);
      }
    });

    this.ws.on("open", () => {
      this.isConnected = true;
      this.reconnectionInterval =
        WS_CLIENT.RECONNECTION_INTERVAL.BASE_IN_SECONDS;
      this.resetPingTimer();

      console.log("🌐 Connected to Compose server");
    });

    this.push = (data) => {
      if (this.ws === null) {
        return;
      }

      this.ws.send(data);
    };

    this.ws.on("message", this.onMessage);
    this.ws.on("error", this.onError);
    this.ws.on("close", (code) => {
      this.onClose(code);
    });
    this.ws.on("ping", () => {
      this.resetPingTimer();
      this.flushSendQueue();
    });
  }

  private resetPingTimer() {
    if (this.pingTimeoutTimer) {
      clearTimeout(this.pingTimeoutTimer);
    }

    this.pingTimeoutTimer = setTimeout(() => {
      if (this.ws) {
        this.ws.terminate();
      }
      this.onClose(WSUtils.PING_TIMEOUT_CODE);
    }, PING_TIMEOUT_MS);
  }

  private onMessage(event: NodeWebSocketRawData) {
    const buffer = new Uint8Array(event as ArrayBuffer);

    // First 2 bytes are always event type
    const eventType = new TextDecoder().decode(buffer.slice(0, 2));

    let data;
    if (eventType === ServerToSdkEvent.TYPE.FILE_TRANSFER) {
      // Bytes 2-38 are the environmentId, hence we start parsing after that
      const executionId = new TextDecoder().decode(buffer.slice(38, 74));
      const fileId = new TextDecoder().decode(buffer.slice(74, 110));

      const fileContents = buffer.slice(110);

      data = {
        type: ServerToSdkEvent.TYPE.FILE_TRANSFER,
        executionId,
        fileId,
        fileContents,
      };
    } else {
      // 2 bytes event types, 36 bytes sessionId, 36 bytes executionId, then JSON object...
      const jsonData = buffer.slice(74);
      data = JSON.parse(
        new TextDecoder().decode(jsonData)
      ) as ServerToSdkEvent.Data;
    }

    this.onMessageCallback(data);
  }

  private onError(error: Error) {
    if (this.ws !== null) {
      this.isConnected = false;
    }
  }

  /**
   * Handles the WebSocket close event -- this will be called once the connection
   * has been closed, meaning there's no reason to try closing the connection again
   * in this function.
   */
  private onClose(code: number) {
    if (this.shuttingDown) {
      return;
    }

    const isServerUpdateInProgress = code === WSUtils.SERVER_UPDATE_CODE;
    const isPingTimeout = code === WSUtils.PING_TIMEOUT_CODE;

    this.ws = null;
    this.isConnected = false;

    let reconnectAfter;

    if (isServerUpdateInProgress) {
      reconnectAfter =
        WSUtils.SERVER_UPDATE_CLIENT_RECONNECTION_INTERVAL_SECONDS;
      console.log(
        `🔄 Compose server update in progress. Attempting to reconnect after ${reconnectAfter} seconds...`
      );
    } else if (isPingTimeout) {
      reconnectAfter = this.reconnectionInterval;
      console.log(
        `Detected silent disconnect from Compose server. Attempting to reconnect after ${reconnectAfter} seconds...`
      );
    } else {
      reconnectAfter = this.reconnectionInterval;
      console.log(
        `🔄 Disconnected from Compose server. Attempting to reconnect after ${reconnectAfter} seconds...`
      );
    }

    this.reconnectionInterval = Math.ceil(
      this.reconnectionInterval *
        WS_CLIENT.RECONNECTION_INTERVAL.BACKOFF_MULTIPLIER
    );

    // Try connecting again after 5 seconds
    setTimeout(() => {
      this.connect();
    }, reconnectAfter * 1000);
  }

  sendRaw(buffer: ArrayBuffer) {
    if (this.isConnected === true) {
      this.push(buffer);
      return;
    }

    const id = uuid();
    this.sendQueue[id] = buffer;
  }

  send(data: SdkToServerEvent.Data, sessionId?: string, executionId?: string) {
    const headerStr =
      data.type === SdkToServerEvent.TYPE.INITIALIZE
        ? data.type
        : data.type + sessionId + executionId;

    const buffer = WSUtils.Message.generateBinary(
      headerStr,
      WSUtils.Message.getBufferFromJson(data)
    );

    this.sendRaw(buffer);
  }

  private flushSendQueue() {
    const keys = Object.keys(this.sendQueue);

    keys.forEach(async (key) => {
      if (this.isConnected === true) {
        this.push(this.sendQueue[key]);
        delete this.sendQueue[key];
      }
    });
  }
}

export { WSClient };
