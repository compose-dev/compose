import { BrowserToServerEvent } from "@compose/ts";
import { FastifyInstance } from "fastify";

async function routes(server: FastifyInstance) {
  // Will fail in the preHandler hook if the user is not authenticated.
  server.get(`/${BrowserToServerEvent.CheckAuth.route}`, async (_, reply) => {
    return reply.code(200).send(null);
  });

  server.get(`/${BrowserToServerEvent.Logout.route}`, async (req, reply) => {
    await server.session.clearSession(req, reply);
    return reply.code(200).send(null);
  });
}

export { routes as authRoutes };
