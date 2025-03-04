import { FastifyInstance, FastifyPluginOptions } from "fastify";

import { createPlugin } from "../../utils/plugin";

import { CustomerBillingServiceStub } from "./customer";
import { BillingGatewayServiceStub } from "./gateway";

function fastifyBilling(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void
) {
  if (!fastify.billing) {
    const gateway = new BillingGatewayServiceStub();

    fastify.decorate("billing", {
      gateway,
      fetchCustomer: CustomerBillingServiceStub.create,
    });

    fastify.addHook(
      "onClose",
      (instance: FastifyInstance, done: () => void) => {
        done();
      }
    );
  }

  done();
}

export default createPlugin(fastifyBilling, {
  name: "billing",
});
