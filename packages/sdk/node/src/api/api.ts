import { SdkToServerEvent, ServerToSdkEvent } from "@composehq/ts-public";
import { WSClient } from "./wsClient";
import { debug } from "../utils";

type ListenerEvent =
  | ServerToSdkEvent.Data
  | {
      type: typeof ServerToSdkEvent.TYPE.FILE_TRANSFER;
      executionId: string;
      fileId: string;
      fileContents: ArrayBuffer;
    };

const EVENT_TYPE_PRETTY = Object.fromEntries(
  Object.entries(SdkToServerEvent.TYPE).map(([key, value]) => [value, key])
);

class Api {
  private apiKey: string;
  private isDevelopment: boolean;
  private packageName: string;
  private packageVersion: string;
  private debug: boolean;

  private wsClient: WSClient;

  private listeners: Record<string, (event: ListenerEvent) => void> = {};

  constructor(
    isDevelopment: boolean,
    apiKey: string,
    packageName: string,
    packageVersion: string,
    options: {
      debug?: boolean;
      host?: string;
    } = {}
  ) {
    this.isDevelopment = isDevelopment;
    this.apiKey = apiKey;
    this.packageName = packageName;
    this.packageVersion = packageVersion;
    this.debug = options.debug ?? false;

    this.addListener = this.addListener.bind(this);
    this.removeListener = this.removeListener.bind(this);
    this.connect = this.connect.bind(this);
    this.shutdown = this.shutdown.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.sendRaw = this.sendRaw.bind(this);
    this.send = this.send.bind(this);

    this.wsClient = new WSClient(
      this.isDevelopment,
      this.apiKey,
      this.packageName,
      this.packageVersion,
      this.onMessage,
      options.host
    );
  }

  addListener(id: string, listener: (event: ListenerEvent) => void) {
    if (id in this.listeners) {
      throw new Error(`Listener with id ${id} already exists`);
    }

    this.listeners[id] = listener;
  }

  removeListener(id: string) {
    if (!(id in this.listeners)) {
      return;
    }

    delete this.listeners[id];
  }

  connect() {
    if (this.wsClient) {
      this.wsClient.connect();
    }
  }

  shutdown() {
    if (this.wsClient) {
      this.wsClient.shutdown();
    }
  }

  onMessage(event: ListenerEvent) {
    for (const listener of Object.values(this.listeners)) {
      listener(event);
    }
  }

  sendRaw(buffer: ArrayBuffer) {
    if (this.wsClient) {
      this.wsClient.sendRaw(buffer);
    }
  }

  send(event: SdkToServerEvent.Data, sessionId?: string, executionId?: string) {
    if (this.debug) {
      debug.log(
        "Send websocket message",
        EVENT_TYPE_PRETTY[event.type] || "unknown"
      );
    }

    if (this.wsClient) {
      this.wsClient.send(event, sessionId, executionId);
    }
  }
}

export { Api };
