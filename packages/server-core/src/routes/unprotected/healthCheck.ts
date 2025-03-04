import { FastifyInstance } from "fastify";

import { HealthCheck } from "../../services/healthCheck";

async function routes(server: FastifyInstance, healthCheck: HealthCheck) {
  server.get(`/health-check`, async (req, reply) => {
    if (!healthCheck.healthy) {
      return reply.code(503).send("failure");
    } else {
      return reply.code(200).send("success");
    }
  });
}

export { routes as healthCheckRoutes };
