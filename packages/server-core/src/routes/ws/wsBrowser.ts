import { IncomingMessage } from "http";
import { parse } from "url";

import { m, ServerToBrowserEvent } from "@compose/ts";
import { ServerToSdkEvent, WSUtils } from "@composehq/ts-public";
import { FastifyInstance } from "fastify";
import {
  WebSocket as NodeWebSocket,
  RawData as NodeWebSocketRawData,
} from "ws";

import { db } from "../../models";

import { Authorizations } from "./authorizations";
import { BrowserConnections, SdkConnections } from "./connections";
import {
  ConnectionError,
  generateConnectionStatusMessage,
  textDecoder,
} from "./utils";
import WSBase from "./wsBase";

type BrowserClient = {
  sessionId: string;
  appRoute: string | null;
  environmentId: string | null;
  userId: string | null;
  companyId: string | null;
  executionId: string | null;
};

function parseQueryParam(req: IncomingMessage, param: string): string | null {
  const parsed = parse(req.url!, true).query[param];
  return typeof parsed === "string" && parsed.length > 0 ? parsed : null;
}

class WSBrowser {
  wsBase: WSBase<BrowserClient>;

  private server: FastifyInstance;

  private browserConnections: BrowserConnections;
  private sdkConnections: SdkConnections;
  private authorizations: Authorizations;

  constructor(
    server: FastifyInstance,
    browserConnections: BrowserConnections,
    sdkConnections: SdkConnections,
    authorizations: Authorizations
  ) {
    this.server = server;

    this.browserConnections = browserConnections;
    this.sdkConnections = sdkConnections;
    this.authorizations = authorizations;

    this.authenticate = this.authenticate.bind(this);
    this.onConnection = this.onConnection.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);

    this.wsBase = new WSBase(this.authenticate, this.onConnection);
  }

  private async authenticate(
    req: IncomingMessage
  ): Promise<{ success: true; client: BrowserClient } | ConnectionError.Type> {
    const appRoute = parseQueryParam(req, "appRoute");
    const environmentId = parseQueryParam(req, "environmentId");
    const sessionId = parseQueryParam(req, "sessionId");
    const executionId = parseQueryParam(req, "executionId");

    if (sessionId === null) {
      return ConnectionError.generate("Session ID missing", "brwsr2");
    }

    if (this.browserConnections.exists(sessionId)) {
      return ConnectionError.generate("Session already exists", "brwsr3");
    }

    const sessionUser = await this.server.session.validateWsSession(
      req,
      appRoute,
      environmentId
    );

    if (!sessionUser) {
      return ConnectionError.generate("Invalid session", "brwsr1");
    }

    return {
      success: true,
      client: {
        sessionId,
        appRoute,
        environmentId,
        userId: sessionUser.id,
        companyId: sessionUser.companyId,
        executionId,
      },
    };
  }

  private async onConnection(ws: NodeWebSocket, client: BrowserClient) {
    function push(data: NodeWebSocketRawData) {
      ws.send(data);
    }

    ws.on("message", (event) => {
      this.onMessage(event, client);
    });

    ws.on("unexpected-response", (event) => {
      console.log("unexpected-response", event);
    });

    ws.on("error", (event) => {
      console.log("error", event);
    });

    let subscribeTo: string[] = [];

    if (client.environmentId) {
      const sdkConnection = this.sdkConnections.get(client.environmentId);

      push(
        generateConnectionStatusMessage(
          client.sessionId,
          client.environmentId,
          sdkConnection !== undefined,
          sdkConnection?.metadata.packageName,
          sdkConnection?.metadata.packageVersion
        )
      );

      subscribeTo = [client.environmentId];
    } else {
      if (client.companyId === null || client.userId === null) {
        return;
      }

      const environments = await db.environment.selectByCompanyId(
        this.server.pg,
        client.companyId
      );

      const dbUser = await db.user.selectById(this.server.pg, client.userId);

      if (!dbUser) {
        return;
      }

      const filteredEnvironments = environments.filter(
        (environment) =>
          environment.type !== m.Environment.TYPE.dev ||
          environment.id === dbUser.developmentEnvironmentId
      );

      const enviromentsOnlineById: Record<string, boolean> = {};
      for (const environment of filteredEnvironments) {
        enviromentsOnlineById[environment.id] = this.sdkConnections.exists(
          environment.id
        );
      }

      push(
        Buffer.from(
          WSUtils.Message.generateBinary(
            ServerToBrowserEvent.TYPE.REPORT_ACTIVE_COMPANY_CONNECTIONS,
            WSUtils.Message.getBufferFromJson({
              type: ServerToBrowserEvent.TYPE.REPORT_ACTIVE_COMPANY_CONNECTIONS,
              connections: enviromentsOnlineById,
            })
          )
        )
      );

      subscribeTo = filteredEnvironments.map((environment) => environment.id);
    }

    this.browserConnections.add(client.sessionId, push, subscribeTo, {});
    if (client.environmentId && client.appRoute) {
      if (client.executionId) {
        this.authorizations.authorizeBrowserAndExecution(
          client.sessionId,
          client.environmentId,
          client.appRoute,
          client.executionId
        );
      } else {
        this.authorizations.authorizeBrowser(
          client.sessionId,
          client.environmentId,
          client.appRoute
        );
      }
    }

    const stopPinging = this.wsBase.pingOnInterval(ws, () => {
      stopPinging();
      ws.terminate();
      this.onClose(client);
    });

    ws.on("close", () => {
      stopPinging();
      this.onClose(client);
    });
  }

  private async onMessage(event: NodeWebSocketRawData, client: BrowserClient) {
    const buffer = new Uint8Array(event as ArrayBuffer);

    // First 2 bytes are event type, then 36 bytes after will be connectionId
    const eventType = textDecoder.decode(buffer.slice(0, 2));
    const environmentId = textDecoder.decode(buffer.slice(2, 38));

    if (!client.environmentId || client.environmentId !== environmentId) {
      return;
    }

    if (this.sdkConnections.get(environmentId)?.metadata.useNewHeaderFormat) {
      const executionId = textDecoder.decode(buffer.slice(38, 74));

      if (eventType === ServerToSdkEvent.TYPE.START_EXECUTION) {
        const data = JSON.parse(
          textDecoder.decode(buffer.slice(74))
        ) as ServerToSdkEvent.StartExecution.Data;

        if (
          !this.authorizations.authorizeNewExecutionIfValid(
            client.sessionId,
            executionId,
            environmentId,
            data.appRoute
          )
        ) {
          return;
        }
      } else if (
        !this.authorizations.validateExistingExecution(
          executionId,
          client.sessionId,
          client.environmentId
        )
      ) {
        return;
      }
    }

    this.sdkConnections.push(environmentId, event);

    if (eventType === ServerToSdkEvent.TYPE.BROWSER_SESSION_ENDED) {
      this.authorizations.removeBrowserSession(client.sessionId);
    }
  }

  private async onClose(client: BrowserClient) {
    this.browserConnections.remove(client.sessionId);
    this.authorizations.removeBrowserSession(client.sessionId);
  }
}

export default WSBrowser;
