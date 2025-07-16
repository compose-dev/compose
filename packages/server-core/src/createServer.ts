import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import FastifyStatic from "@fastify/static";
import { fastify, FastifyPluginCallback } from "fastify";

import {
  restRoutes,
  authRoutes,
  billingRoutes,
  externalAppUserRoutes,
  userRoutes,
  auditLogRoutes,
  environmentRoutes,
  reportRoutes,
} from "./routes/protected";
import {
  googleOAuthRoutes,
  loginToAppRoutes,
  signupRoutes,
  healthCheckRoutes,
  uncategorizedRoutes,
} from "./routes/unprotected";
import { WSGateway } from "./routes/ws";
import { HealthCheck } from "./services/healthCheck";

async function createServer(plugins: [FastifyPluginCallback, any][]) {
  const healthCheck = new HealthCheck();

  const server = fastify({ trustProxy: true });

  for (const [plugin, pluginOpts] of plugins) {
    await server.register(plugin, pluginOpts);
  }

  // Spin up the websocket servers (server <-> sdk, server <-> browser)
  const wsGateway = new WSGateway(server);

  // Register protected routes.
  server.register(async function protectedRoutes(protectedServer) {
    // https://fastify.dev/docs/latest/Reference/Decorators/
    protectedServer.decorateRequest("user", undefined);

    // Add the session validate handler to run prior to any of the protected
    // routes.
    protectedServer.addHook("preHandler", async (req, reply) => {
      return await protectedServer.session.validateSession(req, reply);
    });

    protectedServer.register((server) => restRoutes(server, wsGateway));
    protectedServer.register(authRoutes);
    protectedServer.register(externalAppUserRoutes);
    protectedServer.register(userRoutes);
    protectedServer.register(billingRoutes);
    protectedServer.register(auditLogRoutes);
    protectedServer.register(environmentRoutes);
    protectedServer.register(reportRoutes);
  });

  // Register unprotected routes.
  server.register(async function unprotectedRoutes(unprotectedServer) {
    unprotectedServer.register(googleOAuthRoutes);
    unprotectedServer.register(loginToAppRoutes);
    unprotectedServer.register(signupRoutes);
    unprotectedServer.register(uncategorizedRoutes);
    unprotectedServer.register((server) =>
      healthCheckRoutes(server, healthCheck)
    );
  });

  // Register static files to serve the client app.
  if (process.env.NODE_ENV === "production") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    server.register(FastifyStatic, {
      root: path.join(__dirname, "client"),
      prefix: "/",
    });

    server.setNotFoundHandler((request, reply) => {
      const stream = fs.createReadStream(
        path.join(__dirname, "client", "index.html")
      );
      reply.type("text/html").send(stream);
    });
  }

  return { server, wsGateway, healthCheck };
}

export { createServer };
