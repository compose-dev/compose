import { BrowserToServerEvent, m, u } from "@compose/ts";
import { u as uPublic } from "@composehq/ts-public";
import { FastifyInstance } from "fastify";

import { db } from "../../models";
import { apiKeyService } from "../../services/apiKey";
import { emailCodeService } from "../../services/emailCode";
import { WSGateway } from "../ws";

async function routes(server: FastifyInstance, wsGateway: WSGateway) {
  server.get<{
    Reply: {
      200: BrowserToServerEvent.Initialize.SuccessResponseBody;
      "4xx": BrowserToServerEvent.Initialize.ErrorResponseBody;
    };
  }>(`/${BrowserToServerEvent.Initialize.route}`, async (req, reply) => {
    const user = req.user;

    if (!user || user.isExternal) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const dbUser = await db.user.selectById(server.pg, user.id);

    if (!dbUser) {
      return reply.status(400).send({ message: "User not found" });
    }

    const company = await db.company.selectById(server.pg, dbUser.companyId);

    if (!company) {
      return reply.status(400).send({ message: "Company not found" });
    }

    const environments =
      await db.environment.selectByCompanyIdWithDecryptableKeyAndExternalUsers(
        server.pg,
        dbUser.companyId
      );

    const filteredEnvironments = environments
      .filter(
        (environment) =>
          environment.type !== m.Environment.TYPE.dev ||
          environment.id === dbUser.developmentEnvironmentId
      )
      .map((environment) => {
        const { decryptableKey, ...rest } = environment;

        const shouldDecrypt =
          decryptableKey !== null &&
          environment.type === m.Environment.TYPE.dev;

        const decrypted = shouldDecrypt
          ? apiKeyService.decryptTwoWayHash(decryptableKey)
          : null;

        return {
          ...rest,
          key: decrypted,
        };
      });

    reply.status(200).send({
      environments: filteredEnvironments.map((environment) => ({
        ...environment,
        isOnline: false,
      })),
      company,
      user: {
        ...dbUser,
        isExternal: false,
      },
    });
  });

  server.get(
    `/${BrowserToServerEvent.GetSettings.route}`,
    async (req, reply) => {
      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const dbUser = await db.user.selectById(server.pg, user.id);

      if (!dbUser) {
        return reply.status(400).send({ message: "User not found" });
      }

      const canSeeCompanyUsers = u.permission.isAllowed(
        u.permission.FEATURE.VIEW_ORGANIZATION_USERS,
        dbUser.permission
      );

      const users = canSeeCompanyUsers
        ? await db.user.selectByCompanyId(server.pg, user.companyId)
        : [];

      const emailCodes = canSeeCompanyUsers
        ? await db.emailCode.selectByCompanyId(server.pg, user.companyId)
        : [];

      const pendingInvites = emailCodes.filter((code) => {
        const isNotExpired = new Date(code.expiresAt).getTime() > Date.now();

        const isNotRegistered = !users.some(
          (user) => user.email === code.email
        );

        return isNotExpired && isNotRegistered;
      });

      const company = await db.company.selectById(server.pg, user.companyId);

      if (!company) {
        return reply.status(400).send({ message: "Company not found" });
      }

      const response: BrowserToServerEvent.GetSettings.Response = {
        users,
        pendingInvites,
        company,
      };

      reply.status(200).send(response);
    }
  );

  server.post(
    `/${BrowserToServerEvent.GenerateInviteCode.route}`,
    async (req, reply) => {
      const body =
        req.body as BrowserToServerEvent.GenerateInviteCode.RequestBody;

      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const dbUser = await db.user.selectById(server.pg, user.id);

      if (!dbUser) {
        return reply.status(400).send({ message: "User not found" });
      }

      if (
        !u.permission.isAllowed(
          u.permission.FEATURE.ADD_USER,
          dbUser.permission
        )
      ) {
        return reply.status(403).send({
          message: "Forbidden. You are not authorized to add users.",
        });
      }

      const invitedUser = await db.user.selectByEmailCaseInsensitive(
        server.pg,
        body.email
      );

      if (invitedUser) {
        return reply.status(400).send({
          message: `Invited user already exists. Found user with email ${invitedUser.email}. Please reach out to support to resolve this issue: atul@composehq.com`,
        });
      }

      const code = await emailCodeService.generateInviteCode(
        server.pg,
        user.companyId,
        body.email,
        body.accountType,
        body.permission
      );

      const response: BrowserToServerEvent.GenerateInviteCode.Response = code;

      reply.status(200).send(response);
    }
  );

  server.delete<{ Params: { id: string } }>(
    `/${BrowserToServerEvent.DeleteInviteCode.route}`,
    async (req, reply) => {
      const { id } = req.params;

      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const dbUser = await db.user.selectById(server.pg, user.id);

      if (!dbUser) {
        return reply.status(400).send({ message: "User not found" });
      }

      if (
        !u.permission.isAllowed(
          u.permission.FEATURE.REMOVE_PENDING_INVITE,
          dbUser.permission
        )
      ) {
        return reply.status(403).send({
          message:
            "Forbidden. You are not authorized to remove pending invites.",
        });
      }

      const emailCode = await db.emailCode.selectById(server.pg, id);

      if (!emailCode) {
        return reply.status(400).send({ message: "Email code not found" });
      }

      if (emailCode.companyId !== user.companyId) {
        return reply.status(403).send({ message: "Forbidden" });
      }

      await db.emailCode.deleteById(server.pg, id);

      reply.status(200).send({});
    }
  );

  server.post<{
    Body: BrowserToServerEvent.InitializeEnvironmentAndAuthorizeApp.RequestBody;
    Reply: BrowserToServerEvent.InitializeEnvironmentAndAuthorizeApp.ResponseBody;
  }>(
    `/${BrowserToServerEvent.InitializeEnvironmentAndAuthorizeApp.route}`,
    async (req, reply) => {
      const body =
        req.body as BrowserToServerEvent.InitializeEnvironmentAndAuthorizeApp.RequestBody;
      const appRoute = body.appRoute;
      const environmentId = body.environmentId;

      const user = req.user;

      if (!user) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      let dbUser: m.User.DB | null = null;

      if (!user.isExternal) {
        dbUser = await db.user.selectById(server.pg, user.id);
      }

      const validationResponse = await server.session.validateAppUser(
        appRoute,
        environmentId,
        user.companyId,
        user.email,
        user.isExternal
      );

      if (!validationResponse.isValid) {
        return reply
          .status(validationResponse.code)
          .send({ message: validationResponse.message });
      }

      const environment = validationResponse.environment;
      const companyPromise = db.company.selectById(
        server.pg,
        environment.companyId
      );

      const app = environment.apps.filter((app) => app.route === appRoute);

      if (app.length === 0) {
        return reply.status(400).send({ message: "App not found." });
      }

      if (app.length > 1) {
        return reply
          .status(400)
          .send({ message: "Found multiple apps with the same route." });
      }

      server.analytics.capture(
        server.analytics.event.APP_INITIALIZED,
        user.isExternal ? server.analytics.anonymousUserId : user.id,
        environment.companyId,
        {
          appRoute,
          environmentId,
          environmentType: environment.type,
          userEmail: user.email,
          externalUser: user.isExternal,
        }
      );

      // ONLY DO THIS ONCE THE USER HAS BEEN AUTHORIZED TO ACCESS THE APP!
      wsGateway.authorizeBrowser(body.sessionId, appRoute, environmentId);

      const company = await companyPromise;

      if (!company) {
        return reply.status(400).send({ message: "Company not found" });
      }

      if (company.plan !== m.Company.PLANS.HOBBY) {
        await db.log.insert(
          server.pg,
          company.id,
          environment.id,
          environment.type,
          user.id === m.User.FAKE_ID ? null : user.id,
          user.email === m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP
            ? null
            : user.email,
          appRoute,
          m.Log.APP_INITIALIZED_MESSAGE,
          null,
          uPublic.log.SEVERITY.INFO,
          uPublic.log.TYPE.SYSTEM
        );
      }

      return reply.status(200).send({
        environment: {
          name: environment.name,
          type: environment.type,
          theme: environment.theme,
          apps: environment.apps,
          sdkPackageName: environment.data.packageName,
          sdkPackageVersion: environment.data.packageVersion,
          navs: environment.data.navs || [],
        },
        app: app[0],
        user: dbUser
          ? {
              ...dbUser,
              isExternal: false,
            }
          : {
              isExternal: user.isExternal,
            },
        companyName: company.name,
      });
    }
  );

  server.post(`/${BrowserToServerEvent.Log.route}`, async (req, reply) => {
    const user = req.user;

    if (!user || user.isExternal) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const body = req.body as BrowserToServerEvent.Log.RequestBody;

    server.analytics.capture(
      body.event as (typeof server.analytics.event)[keyof typeof server.analytics.event],
      user.id,
      user.companyId,
      body.data
    );

    reply.status(200).send({ success: true });
  });
}

export { routes as restRoutes };
