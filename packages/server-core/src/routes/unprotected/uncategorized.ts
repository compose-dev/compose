import { BrowserToServerEvent } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { db } from "../../models";

async function routes(server: FastifyInstance) {
  server.post<{
    Body: BrowserToServerEvent.LogError.RequestBody;
    Reply: BrowserToServerEvent.LogError.ResponseBody;
  }>(`/${BrowserToServerEvent.LogError.route}`, async (req, reply) => {
    const userData = await server.session.fetchUserDataIfExists(req);

    await db.errorLog.insert(server.pg, {
      ...req.body,
      userData,
    });

    return reply.code(200).send({
      success: true,
    });
  });
}

export { routes as uncategorizedRoutes };
