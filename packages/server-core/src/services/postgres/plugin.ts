import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { PoolConfig } from "pg";

import { Postgres } from "./postgres";

interface FastifyPGOptions extends PoolConfig {}

function fastifyPG(
  fastify: FastifyInstance,
  options: FastifyPGOptions,
  done: () => void
) {
  if (!fastify.pg) {
    const pg = new Postgres(options);

    fastify.decorate("pg", pg);

    fastify.addHook("onClose", async (instance: FastifyInstance) => {
      await instance.pg.close();
    });
  }

  done();
}

export default fp(fastifyPG, {
  name: "pg",
});
