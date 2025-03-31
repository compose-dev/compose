import { IncomingMessage } from "http";

import { m, ServerToBrowserEvent } from "@compose/ts";
import { SdkToServerEvent, WSUtils, u as uPublic } from "@composehq/ts-public";
import { FastifyInstance } from "fastify";
import {
  WebSocket as NodeWebSocket,
  RawData as NodeWebSocketRawData,
} from "ws";

import { d } from "../../domain";
import { db } from "../../models";
import { apiKeyService } from "../../services/apiKey";

import { Authorizations } from "./authorizations";
import { BrowserConnections, SdkConnections } from "./connections";
import {
  ConnectionError,
  generateConnectionStatusMessage,
  textDecoder,
} from "./utils";
import WSBase from "./wsBase";

const MIN_SUPPORTED_PACKAGE_VERSION: Record<uPublic.sdkPackage.Name, string> = {
  [uPublic.sdkPackage.NAME.NODE]: "0.19.0",
  [uPublic.sdkPackage.NAME.PYTHON]: "0.19.0",
};

type SdkClient = {
  environment: m.Environment.ApiAndDecryptableKeyOmittedDB;
  packageName: uPublic.sdkPackage.Name;
  packageVersion: string;
  company: m.Company.DB;
};

function isAppHidden(hidden: boolean | undefined, isChildApp: boolean) {
  if (hidden !== undefined) {
    return hidden;
  }

  if (isChildApp) {
    return true;
  }

  return false;
}

class WSSdk {
  wsBase: WSBase<SdkClient>;

  private server: FastifyInstance;

  private browserConnections: BrowserConnections;
  private sdkConnections: SdkConnections;
  private authorizations: Authorizations;

  private auditLogRateLimiters: Record<string, uPublic.RateLimiter>;

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

    this.auditLogRateLimiters = {};

    this.authenticate = this.authenticate.bind(this);
    this.onConnection = this.onConnection.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
    this.handleInitialize = this.handleInitialize.bind(this);
    this.handleWriteAuditLog = this.handleWriteAuditLog.bind(this);

    this.wsBase = new WSBase(this.authenticate, this.onConnection);
  }

  private async authenticate(
    req: IncomingMessage
  ): Promise<{ success: true; client: SdkClient } | ConnectionError.Type> {
    const apiKey = req.headers["x-compose-api-key"];
    const packageName = req.headers[
      "x-compose-package-name"
    ] as uPublic.sdkPackage.Name;
    const packageVersion = req.headers["x-compose-package-version"];

    if (
      !packageName ||
      typeof packageName !== "string" ||
      !Object.values(uPublic.sdkPackage.NAME).includes(packageName)
    ) {
      return ConnectionError.generate(
        `Invalid package name. Received ${
          packageName === undefined || packageName === null
            ? "undefined"
            : JSON.stringify(packageName)
        }.`,
        "srvr4"
      );
    }

    if (!packageVersion || typeof packageVersion !== "string") {
      return ConnectionError.generate(
        `Invalid package version. Received ${packageVersion === undefined ? "undefined" : JSON.stringify(packageVersion)}.`,
        "srvr5"
      );
    }

    const isSupportedVersion = uPublic.sdkPackage.meetsMinimumVersion(
      packageVersion,
      MIN_SUPPORTED_PACKAGE_VERSION[packageName]
    );

    if (!isSupportedVersion.success) {
      return ConnectionError.generate(isSupportedVersion.error, "srvr1");
    }

    if (apiKey === undefined) {
      return ConnectionError.generate("Missing API key.", "srvr6");
    }

    if (typeof apiKey !== "string") {
      return ConnectionError.generate("Invalid API key.", "srvr7");
    }

    const hashedKey = apiKeyService.generateOneWayHash(apiKey);

    const environment = await db.environment.selectByApiKey(
      this.server.pg,
      hashedKey
    );

    if (environment === null) {
      return ConnectionError.generate("Invalid API key.", "srvr8");
    }

    const company = await db.company.selectById(
      this.server.pg,
      environment.companyId
    );

    if (company === null) {
      return ConnectionError.generate(
        "Could not find account associated with this API key.",
        "srvr10"
      );
    }

    if (this.sdkConnections.exists(environment.id)) {
      return ConnectionError.generate("Connection already exists.", "srvr9");
    }

    return {
      success: true,
      client: {
        environment,
        packageName,
        packageVersion,
        company,
      },
    };
  }

  private async onConnection(ws: NodeWebSocket, client: SdkClient) {
    this.sdkConnections.add(client.environment.id, push, [], {
      packageName: client.packageName,
      packageVersion: client.packageVersion,
      useNewHeaderFormat: uPublic.sdkPackage.shouldUseNewHeaderFormat(
        client.packageName,
        client.packageVersion
      ),
    });

    this.browserConnections.pushToSubscribers(
      client.environment.id,
      (browserSessionId) =>
        generateConnectionStatusMessage(
          browserSessionId,
          client.environment.id,
          true,
          client.packageName,
          client.packageVersion
        )
    );

    ws.on("message", (event) => {
      this.onMessage(event, client);
    });

    function push(data: NodeWebSocketRawData) {
      ws.send(data);
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

  private async onMessage(event: NodeWebSocketRawData, client: SdkClient) {
    const buffer = new Uint8Array(event as ArrayBuffer);

    // First 2 bytes are always event type
    const eventType = textDecoder.decode(buffer.slice(0, 2));

    if (eventType === SdkToServerEvent.TYPE.INITIALIZE) {
      // Initialize events have no connectionId. Hence, the JSON
      // payload is directly following the eventType bytes.
      const data = JSON.parse(
        textDecoder.decode(buffer.slice(2))
      ) as SdkToServerEvent.Initialize.Data;

      this.handleInitialize(data, client);
      return;
    }

    const connectionId = textDecoder.decode(buffer.slice(2, 38));

    if (this.sdkConnections.get(connectionId)?.metadata.useNewHeaderFormat) {
      const executionId = textDecoder.decode(buffer.slice(38, 74));

      if (
        !this.authorizations.validateExistingExecution(
          executionId,
          connectionId,
          client.environment.id
        )
      ) {
        return;
      }
    }

    // Write to audit log AFTER the executionId is validated
    if (eventType === SdkToServerEvent.TYPE.WRITE_AUDIT_LOG) {
      try {
        this.handleWriteAuditLog(connectionId, buffer, client);
      } catch (error) {
        // Swallow any errors to prevent crashing
        console.error("Error in handleWriteAuditLog:", error);
      }
      return;
    }

    this.browserConnections.push(connectionId, event);
  }

  private async handleInitialize(
    data: SdkToServerEvent.Initialize.Data,
    client: SdkClient
  ) {
    const apps: m.Environment.DB["apps"] = [];

    for (const app of data.apps) {
      // Check if the app is already inheriting permissions from another app.
      // We'll use this to determine if we need to update/delete/insert some
      // rows into the db.
      const existingParentPermissions = (
        await db.externalAppUser.selectByAppRouteAndEnvironmentId(
          this.server.pg,
          app.route,
          client.environment.id
        )
      ).filter((user) =>
        user.email.startsWith(
          m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX
        )
      );

      const newParentAppRoute = app.parentAppRoute;

      if (newParentAppRoute !== undefined) {
        const incorrectPermissions = existingParentPermissions.filter(
          (permission) =>
            permission.email.slice(
              m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX.length
            ) !== newParentAppRoute
        );

        // First, let's delete any incorrect permissions.
        for (const incorrectPermission of incorrectPermissions) {
          await db.externalAppUser.deleteById(
            this.server.pg,
            incorrectPermission.id
          );
        }

        // Next, if the number of incorrect permissions is equal to the
        // number of existing permissions, we need to set the new permission,
        // since the correct one doesn't exist yet.
        if (incorrectPermissions.length === existingParentPermissions.length) {
          const permissionEmail = `${m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX}${newParentAppRoute}`;

          await db.externalAppUser.insertFromSdk(
            this.server.pg,
            client.environment.companyId,
            permissionEmail,
            client.environment.id,
            app.route
          );
        }
      } else {
        // In the else case, we should delete all existing parent permissions.
        for (const permission of existingParentPermissions) {
          await db.externalAppUser.deleteById(this.server.pg, permission.id);
        }
      }

      const hidden = isAppHidden(app.hidden, app.parentAppRoute !== undefined);

      apps.push({
        ...app,
        hidden,
      });
    }

    const navs = d.errorLog.tryFunction(
      () => {
        if (data.navs) {
          return data.navs.map((nav) => ({
            ...nav,
            items: nav.items.map((item) => ({
              label: apps.find((app) => app.route === item)?.name || item,
              route: item,
            })),
          }));
        }
      },
      this.server,
      "Error parsing navs"
    );

    await db.environment.updateConfiguration(
      this.server.pg,
      client.environment.id,
      apps,
      data.theme,
      {
        packageName: client.packageName,
        packageVersion: client.packageVersion,
        navs,
      }
    );

    this.browserConnections.pushToSubscribers(
      client.environment.id,
      (browserSessionId) =>
        Buffer.from(
          WSUtils.Message.generateBinary(
            `${ServerToBrowserEvent.TYPE.ENVIRONMENT_INITIALIZED}${browserSessionId}`,
            WSUtils.Message.getBufferFromJson({
              type: ServerToBrowserEvent.TYPE.ENVIRONMENT_INITIALIZED,
              environmentId: client.environment.id,
            })
          )
        )
    );
  }

  private async handleWriteAuditLog(
    connectionId: string,
    buffer: Uint8Array,
    client: SdkClient
  ) {
    try {
      if (client.company.plan === m.Company.PLANS.HOBBY) {
        throw new Error(
          "Failed to write audit log. Hobby plan does not support audit logs."
        );
      }

      if (!this.auditLogRateLimiters[client.company.id]) {
        const rateLimit =
          client.company.flags[
            m.Company.FLAG_KEYS.AUDIT_LOG_RATE_LIMIT_PER_MINUTE
          ];

        this.auditLogRateLimiters[client.company.id] = new uPublic.RateLimiter(
          typeof rateLimit === "number" ? rateLimit : 200,
          60 * 1000
        );
      }

      const rateLimiter = this.auditLogRateLimiters[client.company.id];

      if (rateLimiter.invoke() === "error") {
        throw new Error(
          `Audit log rate limit exceeded. Max allowed is ${rateLimiter.maxInvocationsPerInterval} logs per minute. Please contact support if you need to increase this limit.`
        );
      }

      const browserData = this.browserConnections.get(connectionId);

      if (!browserData) {
        throw new Error(
          "Failed to write audit log. Browser connection not found."
        );
      }

      const metadataEmail = browserData.metadata.userEmail;
      const metadataUserId = browserData.metadata.userId;

      const userEmail =
        metadataEmail === m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP
          ? null
          : metadataEmail;

      const userId = metadataUserId === m.User.FAKE_ID ? null : metadataUserId;

      const data = JSON.parse(
        textDecoder.decode(buffer.slice(74))
      ) as SdkToServerEvent.WriteAuditLog.Data;

      await d.log.writeLogIfValid(
        this.server,
        data.message,
        data.data ?? null,
        data.severity ?? uPublic.log.SEVERITY.INFO,
        uPublic.log.TYPE.USER,
        client.company.id,
        client.environment.id,
        userId,
        userEmail,
        browserData.metadata.appRoute ?? "UNKNOWN_APP_ROUTE",
        client.company.plan
      );
    } catch (e) {
      if (e instanceof Error) {
        const eventData: ServerToBrowserEvent.AppErrorV2.Data = {
          type: ServerToBrowserEvent.TYPE.APP_ERROR_V2,
          errorMessage: e.message,
          severity: "info",
        };

        const executionId = textDecoder.decode(buffer.slice(38, 74));
        const eventHeader = `${ServerToBrowserEvent.TYPE.APP_ERROR_V2}${connectionId}${executionId}`;

        const event = WSUtils.Message.generateBinary(
          eventHeader,
          WSUtils.Message.getBufferFromJson(eventData)
        );

        // Notify the browser client via toast that an error occurred
        this.browserConnections.push(connectionId, event);
      }
    }
  }

  private async onClose(client: SdkClient) {
    this.sdkConnections.remove(client.environment.id);

    this.browserConnections.pushToSubscribers(
      client.environment.id,
      (browserSessionId) =>
        generateConnectionStatusMessage(
          browserSessionId,
          client.environment.id,
          false,
          client.packageName,
          client.packageVersion
        )
    );
  }
}

export default WSSdk;
