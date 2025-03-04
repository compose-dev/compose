import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

import { AnalyticsServiceStub } from "./analytics";

function fastifyAnalytics(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  if (!fastify.analytics) {
    const analytics = new AnalyticsServiceStub();

    fastify.decorate("analytics", analytics);

    fastify.addHook(
      "onClose",
      (instance: FastifyInstance, done: () => void) => {
        instance.analytics.shutdown();
        done();
      }
    );
  }

  done();
}

export default fp(fastifyAnalytics, {
  name: "analytics",
});
