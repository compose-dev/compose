import { BrowserToServerEvent, m, u } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { db } from "../../models";
import { apiKeyService } from "../../services/apiKey";

async function routes(server: FastifyInstance) {
  server.get<{ Params: { environmentId: string } }>(
    `/${BrowserToServerEvent.FetchEnvironmentWithDetails.route}`,
    async (req, reply) => {
      const { environmentId } = req.params;

      if (!environmentId) {
        return reply
          .status(400)
          .send({ message: "Environment ID is required" });
      }

      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const dbUser = await db.user.selectById(server.pg, user.id);

      if (!dbUser) {
        return reply.status(400).send({ message: "User not found" });
      }

      const environment = await db.environment.selectByIdWithExternalUsers(
        server.pg,
        environmentId
      );

      if (!environment) {
        return reply.status(400).send({ message: "Environment not found" });
      }

      if (
        environment.type === m.Environment.TYPE.dev &&
        environment.id !== dbUser.developmentEnvironmentId
      ) {
        return reply.status(403).send({ message: "Forbidden" });
      }

      const response: BrowserToServerEvent.FetchEnvironmentWithDetails.Response =
        {
          environment,
        };

      reply.status(200).send(response);
    }
  );

  server.get<{
    Reply: {
      200: BrowserToServerEvent.FetchEnvironments.SuccessResponseBody;
      "4xx": BrowserToServerEvent.FetchEnvironments.ErrorResponseBody;
    };
  }>(`/${BrowserToServerEvent.FetchEnvironments.route}`, async (req, reply) => {
    const user = req.user;

    if (!user || user.isExternal) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const dbUser = await db.user.selectById(server.pg, user.id);

    if (!dbUser) {
      return reply.status(400).send({ message: "User not found" });
    }

    const environments = await db.environment.selectByCompanyId(
      server.pg,
      dbUser.companyId
    );

    reply.status(200).send({ environments });
  });

  server.post(
    `/${BrowserToServerEvent.CreateEnvironment.route}`,
    async (req, reply) => {
      const body =
        req.body as BrowserToServerEvent.CreateEnvironment.RequestBody;

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
          body.type === m.Environment.TYPE.dev
            ? u.permission.FEATURE.CREATE_DEVELOPMENT_ENVIRONMENT
            : u.permission.FEATURE.CREATE_PRODUCTION_ENVIRONMENT,
          dbUser.permission
        )
      ) {
        return reply.status(403).send({
          message: `Forbidden. You are not authorized to create ${body.type} environments.`,
        });
      }

      const key = apiKeyService.generate(body.type);

      const environment = await db.environment.insert(
        server.pg,
        user.companyId,
        body.name,
        body.type,
        key.oneWayHash,
        key.twoWayHash
      );

      const response: BrowserToServerEvent.CreateEnvironment.Response = {
        ...environment,
        key: key.plaintext,
      };

      reply.status(200).send(response);
    }
  );

  server.delete<{
    Params: { environmentId: string };
    Reply: {
      200: BrowserToServerEvent.DeleteEnvironment.SuccessResponseBody;
      "4xx": BrowserToServerEvent.DeleteEnvironment.ErrorResponseBody;
    };
  }>(`/${BrowserToServerEvent.DeleteEnvironment.route}`, async (req, reply) => {
    const { environmentId } = req.params;

    const user = req.user;

    if (!user || user.isExternal) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const dbUser = await db.user.selectById(server.pg, user.id);

    if (!dbUser) {
      return reply.status(400).send({ message: "User not found" });
    }

    const environment = await db.environment.selectById(
      server.pg,
      environmentId
    );

    if (!environment) {
      return reply.status(400).send({ message: "Environment not found" });
    }

    if (environment.companyId !== user.companyId) {
      return reply.status(403).send({ message: "Forbidden" });
    }

    if (environment.type === m.Environment.TYPE.dev) {
      return reply.status(400).send({
        message: "Cannot delete development environments.",
      });
    }

    if (
      !u.permission.isAllowed(
        u.permission.FEATURE.DELETE_PRODUCTION_ENVIRONMENT,
        dbUser.permission
      )
    ) {
      return reply.status(403).send({
        message:
          "You are not authorized to delete production environments. Only users with app manager or above permissions can delete production environments.",
      });
    }

    await db.environment.deleteById(server.pg, environmentId, user.companyId);

    reply.status(200).send({ success: true });
  });

  server.post<{
    Params: { environmentId: string };
    Reply: {
      200: BrowserToServerEvent.RefreshEnvironmentApiKey.SuccessResponseBody;
      "4xx": BrowserToServerEvent.RefreshEnvironmentApiKey.ErrorResponseBody;
    };
  }>(
    `/${BrowserToServerEvent.RefreshEnvironmentApiKey.route}`,
    async (req, reply) => {
      const { environmentId } = req.params;

      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const dbUser = await db.user.selectById(server.pg, user.id);

      if (!dbUser) {
        return reply.status(400).send({ message: "User not found" });
      }

      const environment = await db.environment.selectById(
        server.pg,
        environmentId
      );

      if (!environment) {
        return reply.status(400).send({ message: "Environment not found" });
      }

      if (environment.companyId !== user.companyId) {
        return reply.status(403).send({ message: "Forbidden" });
      }

      if (
        environment.type === m.Environment.TYPE.dev &&
        environment.id !== dbUser.developmentEnvironmentId
      ) {
        return reply.status(403).send({
          message:
            "You are not authorized to refresh the API key for another user's development environment.",
        });
      }

      if (
        environment.type === m.Environment.TYPE.prod &&
        !u.permission.isAllowed(
          u.permission.FEATURE.REFRESH_PRODUCTION_ENVIRONMENT_API_KEY,
          dbUser.permission
        )
      ) {
        return reply.status(403).send({
          message:
            "You are not authorized to refresh the API key for production environments. Only users with app manager or above permissions can refresh production environment keys.",
        });
      }

      const key = apiKeyService.generate(environment.type);

      const updatedEnvironment = await db.environment.updateApiKey(
        server.pg,
        environmentId,
        user.companyId,
        key.oneWayHash,
        key.twoWayHash
      );

      if (!updatedEnvironment) {
        return reply.status(400).send({
          message:
            "Failed to refresh environment API key. Please try again or contact support if the issue persists.",
        });
      }

      reply.status(200).send({
        environment: {
          ...updatedEnvironment,
          key: key.plaintext,
        },
      });
    }
  );
}

export { routes as environmentRoutes };
