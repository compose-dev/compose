import { IncomingMessage } from "http";
import { Duplex } from "stream";

import { WSUtils } from "@composehq/ts-public";
import {
  WebSocketServer as NodeWebSocketServer,
  WebSocket as NodeWebSocket,
} from "ws";

import { ConnectionError } from "./utils";

const PING_INTERVAL = 20000;

const makeErrorResponse = (error: ConnectionError.Type) =>
  "HTTP/1.1 400 Bad Request\r\n" +
  "Content-Type: text/plain\r\n" +
  `x-compose-error-reason: ${encodeURIComponent(error.message)}\r\n` +
  `x-compose-error-code: ${error.code}\r\n` +
  "\r\n" +
  "Bad Request";

type AuthCallback<TClient> = (
  request: IncomingMessage
) => Promise<{ success: true; client: TClient } | ConnectionError.Type>;

class WSBase<TClient> {
  private wss: NodeWebSocketServer;
  private authenticate: AuthCallback<TClient>;

  constructor(
    authenticate: AuthCallback<TClient>,
    onConnection: (ws: NodeWebSocket, client: TClient) => void
  ) {
    this.authenticate = authenticate;

    this.handleUpgrade = this.handleUpgrade.bind(this);
    this.pingOnInterval = this.pingOnInterval.bind(this);

    this.wss = new NodeWebSocketServer({ noServer: true });
    this.wss.on("connection", onConnection);
  }

  async handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer) {
    const authResult = await this.authenticate(request);

    if (!authResult.success) {
      console.dir(authResult, { depth: null });
      socket.write(makeErrorResponse(authResult));
      socket.destroy();
      return;
    }

    this.wss.handleUpgrade(request, socket, head, (ws) => {
      this.wss.emit("connection", ws, authResult.client);
    });
  }

  pingOnInterval(ws: NodeWebSocket, onNotAlive: () => void): () => void {
    let isAlive = false;
    ws.ping();

    const interval = setInterval(() => {
      if (!isAlive) {
        onNotAlive();
        return;
      }

      isAlive = false;
      ws.ping();
    }, PING_INTERVAL);

    // setup pong
    ws.on("pong", () => {
      isAlive = true;
    });

    function stopPinging() {
      clearInterval(interval);
    }

    return stopPinging;
  }

  async handleSigterm() {
    this.wss.clients.forEach((ws) => {
      if (ws.readyState === NodeWebSocket.OPEN) {
        ws.close(WSUtils.SERVER_UPDATE_CODE, "Server update in progress.");
      }
    });

    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        console.warn("WebSocket server close timed out");
        resolve();
      }, 3000); // 3 seconds timeout

      this.wss.close(() => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }
}

export default WSBase;
