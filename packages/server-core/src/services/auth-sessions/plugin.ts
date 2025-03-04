import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

import { Session } from "./session";

function fastifySession(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  if (!fastify.session) {
    const session = new Session(fastify.pg);
    fastify.decorate("session", session);
  }

  done();
}

export default fp(fastifySession, {
  name: "session",
});
