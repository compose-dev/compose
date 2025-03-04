import {
  FastifyInstanceExtensions,
  FastifyRequestExtensions,
} from "./fastifyExtensions";

declare module "fastify" {
  interface FastifyInstance extends FastifyInstanceExtensions {}
  interface FastifyRequest extends FastifyRequestExtensions {}
}
