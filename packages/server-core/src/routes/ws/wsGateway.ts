import { IncomingMessage } from "http";
import { Duplex } from "stream";

import { WSUtils } from "@composehq/ts-public";
import { FastifyInstance } from "fastify";

import { Authorizations } from "./authorizations";
import { SdkConnections, BrowserConnections } from "./connections";
import WSBrowser from "./wsBrowser";
import WSSdk from "./wsSdk";
class WSGateway {
  private wsSdk: WSSdk;
  private wsBrowser: WSBrowser;

  private browserConnections: BrowserConnections;
  private sdkConnections: SdkConnections;

  private authorizations: Authorizations;

  constructor(server: FastifyInstance) {
    this.browserConnections = new BrowserConnections();
    this.sdkConnections = new SdkConnections();
    this.authorizations = new Authorizations();

    this.wsSdk = new WSSdk(
      server,
      this.browserConnections,
      this.sdkConnections,
      this.authorizations
    );

    this.wsBrowser = new WSBrowser(
      server,
      this.browserConnections,
      this.sdkConnections,
      this.authorizations
    );

    server.server.on("upgrade", (req, socket, head) => {
      this.handleUpgrade(req, socket, head);
    });

    this.handleUpgrade = this.handleUpgrade.bind(this);
  }

  private async handleUpgrade(
    request: IncomingMessage,
    socket: Duplex,
    head: Buffer
  ) {
    const url = new URL(request.url || "", `https://${request.headers.host}`);

    if (url.pathname === `/${WSUtils.Routes.SDK_TO_SERVER_PATH}`) {
      this.wsSdk.wsBase.handleUpgrade(request, socket, head);
      return;
    }

    if (url.pathname === `/${WSUtils.Routes.BROWSER_TO_SERVER_PATH}`) {
      this.wsBrowser.wsBase.handleUpgrade(request, socket, head);
      return;
    }

    socket.write(WSUtils.NOT_FOUND_RESPONSE);
    socket.destroy();
    return;
  }

  async handleSigterm() {
    await this.wsSdk.wsBase.handleSigterm();
    await this.wsBrowser.wsBase.handleSigterm();
  }

  summarize() {
    return {
      sdkConnections: this.sdkConnections.summarize(),
      browserConnections: this.browserConnections.summarize(),
    };
  }

  authorizeBrowser(
    browserSessionId: string,
    appRoute: string,
    environmentId: string
  ) {
    return this.authorizations.authorizeBrowser(
      browserSessionId,
      environmentId,
      appRoute
    );
  }
}

export default WSGateway;
