import { FastifyInstance, FastifyPluginOptions } from "fastify";

import { createPlugin } from "../../utils/plugin";

import { EmailServiceStub } from "./email";

function fastifyEmail(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  if (!fastify.email) {
    const email = new EmailServiceStub();

    fastify.decorate("email", email);

    fastify.addHook(
      "onClose",
      (instance: FastifyInstance, done: () => void) => {
        instance.email.shutdown();
        done();
      }
    );
  }

  done();
}

export default createPlugin(fastifyEmail, {
  name: "email",
});
