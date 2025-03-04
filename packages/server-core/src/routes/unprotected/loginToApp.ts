import { BrowserToServerEvent, m } from "@compose/ts";
import { FastifyInstance } from "fastify";

async function routes(server: FastifyInstance) {
  server.post(
    `/${BrowserToServerEvent.LoginToApp.route}`,
    async (req, reply) => {
      const { appRoute, environmentId } =
        req.body as BrowserToServerEvent.LoginToApp.RequestBody;

      const authorizationResult = await server.session.validateAppUser(
        appRoute,
        environmentId,
        null,
        m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP,
        true
      );

      if (authorizationResult.isValid) {
        const session = await server.session.createExternalUserSession(
          m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP
        );

        server.session.createAndAttachSessionCookie(session.id, reply);

        return reply.code(200).send({
          success: true,
          requiresLogin: false,
        });
      } else if (
        authorizationResult.message ===
          server.session.ERROR_MESSAGE.MAX_LOOP_ITERATIONS ||
        authorizationResult.message ===
          server.session.ERROR_MESSAGE.ENVIRONMENT_DOES_NOT_EXIST
      ) {
        return reply.code(authorizationResult.code).send(authorizationResult);
      } else {
        return reply.code(200).send({
          success: false,
          requiresLogin: true,
        });
      }
    }
  );
}

export { routes as loginToAppRoutes };
