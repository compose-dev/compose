import { BrowserToServerEvent, ServerToBrowserEvent } from "@compose/ts";
import { WSUtils } from "@composehq/ts-public";
import { getNodeEnvironment } from "~/utils/nodeEnvironment";

const isDev = getNodeEnvironment() === "development";

const WS_URL_PATH = "api/v1/browser/ws";

function getWSUrl() {
  if (isDev) {
    return `ws://localhost:8080/${WS_URL_PATH}`;
  }

  return `wss://${window.location.host}/${WS_URL_PATH}`;
}

const JSON_PARSE_ERROR_EVENT: ServerToBrowserEvent.JsonParseError.Data = {
  type: ServerToBrowserEvent.TYPE.JSON_PARSE_ERROR,
  errorMessage:
    "Error parsing data for most recent SDK message. See console logs inside the developer tools sidebar to inspect the failed message.",
  severity: "warning",
};

function parseWebsocketMessage(text: string): ServerToBrowserEvent.Data {
  try {
    return JSON.parse(text) as ServerToBrowserEvent.Data;
  } catch {
    // Keep these logs (even for production) so we can see the raw text of
    // the failed message, which may be useful for debugging.
    console.log("JSON PARSE ERROR FOR FOLLOWING TEXT:");
    console.log(text);

    return JSON_PARSE_ERROR_EVENT;
  }
}

type WebsocketListener = (
  event: ServerToBrowserEvent.Data,
  args: { executionId?: string }
) => void;

class WSClient {
  private sessionId: string;

  // If connecting to a specific app, these will be set, otherwise they'll be undefined
  private environmentId?: string;
  private appRoute?: string;
  private executionId?: string | null;

  private listeners: Record<string, WebsocketListener> = {};
  private ws: WebSocket | null;
  private setIsConnected: (
    isConnected: boolean,
    serverUpdateStarted?: boolean
  ) => void;
  private timer: NodeJS.Timeout | null;

  isConnected: boolean = false;

  constructor(
    sessionId: string,
    setIsConnected: (
      isConnected: boolean,
      serverUpdateStarted?: boolean
    ) => void,
    environmentId?: string,
    appRoute?: string,
    executionId?: string | null
  ) {
    this.sessionId = sessionId;
    this.ws = null;
    this.setIsConnected = setIsConnected;
    this.timer = null;

    this.onClose = this.onClose.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.connect = this.connect.bind(this);
    this.addListener = this.addListener.bind(this);
    this.removeListener = this.removeListener.bind(this);

    this.environmentId = environmentId;
    this.appRoute = appRoute;
    this.executionId = executionId;
  }

  private onClose(event: CloseEvent) {
    const serverUpdateStarted = event.code === WSUtils.SERVER_UPDATE_CODE;

    this.ws = null;
    this.isConnected = false;
    this.setIsConnected(false, serverUpdateStarted);

    if (this.timer) {
      clearTimeout(this.timer);
    }

    // Try connecting again after 5 seconds or 10 seconds if server update is
    // in progress.
    this.timer = setTimeout(
      () => {
        this.connect();
      },
      serverUpdateStarted
        ? WSUtils.SERVER_UPDATE_CLIENT_RECONNECTION_INTERVAL_SECONDS * 1000
        : 5000
    );
  }

  private async onMessage(event: MessageEvent) {
    const blobData = event.data as Blob;

    const eventType = await blobData.slice(0, 2).text();

    let data: Parameters<WebsocketListener>[0];
    const args: Parameters<WebsocketListener>[1] = {};

    if (
      eventType === ServerToBrowserEvent.TYPE.REPORT_ACTIVE_COMPANY_CONNECTIONS
    ) {
      data = JSON.parse(
        await blobData.slice(2).text()
      ) as ServerToBrowserEvent.ReportActiveCompanyConnections.Data;
    } else {
      const sessionId = await blobData.slice(2, 38).text();

      if (
        eventType !== ServerToBrowserEvent.TYPE.SDK_CONNECTION_STATUS_CHANGED &&
        sessionId !== this.sessionId
      ) {
        return;
      }

      if (eventType === ServerToBrowserEvent.TYPE.FILE_TRANSFER) {
        const metadataBinaryLength = new DataView(
          await blobData.slice(38, 42).arrayBuffer()
        ).getUint32(0, false);

        const metadata = JSON.parse(
          await blobData.slice(42, 42 + metadataBinaryLength).text()
        ) as ServerToBrowserEvent.FileTransfer.Data["metadata"];

        const fileContents = blobData.slice(42 + metadataBinaryLength);

        data = {
          type: ServerToBrowserEvent.TYPE.FILE_TRANSFER,
          metadata,
          fileContents,
        } as ServerToBrowserEvent.FileTransfer.Data;
        args.executionId = metadata.executionId;
      } else if (eventType === ServerToBrowserEvent.TYPE.FILE_TRANSFER_V2) {
        args.executionId = await blobData.slice(38, 74).text();

        const metadataBinaryLength = new DataView(
          await blobData.slice(74, 78).arrayBuffer()
        ).getUint32(0, false);

        const metadata = JSON.parse(
          await blobData.slice(78, 78 + metadataBinaryLength).text()
        ) as ServerToBrowserEvent.FileTransferV2.Data["metadata"];

        const fileContents = blobData.slice(78 + metadataBinaryLength);

        data = {
          type: ServerToBrowserEvent.TYPE.FILE_TRANSFER_V2,
          metadata,
          fileContents,
        } as ServerToBrowserEvent.FileTransferV2.Data;
      } else if (
        eventType === ServerToBrowserEvent.TYPE.APP_ERROR_V2 ||
        eventType === ServerToBrowserEvent.TYPE.RENDER_UI_V2 ||
        eventType === ServerToBrowserEvent.TYPE.FORM_VALIDATION_ERROR_V2 ||
        eventType === ServerToBrowserEvent.TYPE.PAGE_CONFIG_V2 ||
        eventType === ServerToBrowserEvent.TYPE.EXECUTION_EXISTS_RESPONSE_V2 ||
        eventType === ServerToBrowserEvent.TYPE.INPUT_VALIDATION_ERROR_V2 ||
        eventType === ServerToBrowserEvent.TYPE.LINK_V2 ||
        eventType === ServerToBrowserEvent.TYPE.FORM_SUBMISSION_SUCCESS_V2 ||
        eventType === ServerToBrowserEvent.TYPE.RELOAD_PAGE_V2 ||
        eventType === ServerToBrowserEvent.TYPE.CONFIRM_V2 ||
        eventType === ServerToBrowserEvent.TYPE.TOAST_V2 ||
        eventType === ServerToBrowserEvent.TYPE.RERENDER_UI_V3 ||
        eventType === ServerToBrowserEvent.TYPE.SET_INPUTS_V2 ||
        eventType === ServerToBrowserEvent.TYPE.CLOSE_MODAL_V2 ||
        eventType === ServerToBrowserEvent.TYPE.UPDATE_LOADING_V2 ||
        eventType === ServerToBrowserEvent.TYPE.TABLE_PAGE_CHANGE_RESPONSE_V2 ||
        eventType === ServerToBrowserEvent.TYPE.STALE_STATE_UPDATE_V2
      ) {
        const executionId = await blobData.slice(38, 74).text();

        // 2 bytes event type, 36 bytes sessionId, 36 bytes executionId, then JSON object...
        const text = await blobData.slice(74).text();
        data = parseWebsocketMessage(text);
        args.executionId = executionId;
      } else {
        // 2 bytes event type, 36 bytes sessionId, then JSON object...
        const text = await blobData.slice(38).text();
        data = parseWebsocketMessage(text);
        args.executionId = "executionId" in data ? data.executionId : undefined;
      }
    }

    Object.values(this.listeners).forEach((listener) => listener(data, args));
  }

  connect() {
    const url = new URL(getWSUrl());
    url.searchParams.set("sessionId", this.sessionId);

    if (this.environmentId) {
      url.searchParams.set("environmentId", this.environmentId);
    }

    if (this.appRoute) {
      url.searchParams.set("appRoute", this.appRoute);
    }

    if (this.executionId) {
      url.searchParams.set("executionId", this.executionId);
    }

    this.ws = new WebSocket(url.toString());

    this.ws.onopen = () => {
      this.isConnected = true;
      this.setIsConnected(true);
    };

    this.ws.onclose = this.onClose;
    this.ws.onmessage = this.onMessage;
  }

  addListener(id: string, listener: WebsocketListener) {
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

  sendJson(
    data: BrowserToServerEvent.WS.Data,
    environmentId: string,
    useNewHeaderFormat: boolean // will be true if the SDK version >= 0.25.8
  ) {
    if (!this.isConnected || !this.ws) {
      return;
    }

    // Until the minimum supported SDK version >= 0.25.8, we need to continue
    // supporting the old header format.
    if (useNewHeaderFormat) {
      const buffer = WSUtils.Message.generateBinary(
        `${data.type}${environmentId}${data.executionId}`,
        WSUtils.Message.getBufferFromJson(data)
      );
      this.ws.send(buffer);
    } else {
      const buffer = WSUtils.Message.generateBinary(
        `${data.type}${environmentId}`,
        WSUtils.Message.getBufferFromJson(data)
      );
      this.ws.send(buffer);
    }
  }

  sendRaw(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    if (!this.isConnected || !this.ws) {
      return;
    }

    this.ws.send(data);
  }

  updateExecutionId(executionId: string | null) {
    this.executionId = executionId;
  }
}

export default WSClient;
export type { WebsocketListener };
