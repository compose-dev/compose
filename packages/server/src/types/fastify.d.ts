import type {
  FastifyInstanceExtensions,
  FastifyRequestExtensions,
} from "server-core";

declare module "fastify" {
  interface FastifyInstance extends FastifyInstanceExtensions {}
  interface FastifyRequest extends FastifyRequestExtensions {}
}
