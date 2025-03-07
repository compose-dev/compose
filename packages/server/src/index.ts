import {
  createServer,
  postgresFastifyPlugin,
  sessionFastifyPlugin,
  analyticsFastifyPlugin,
  emailFastifyPlugin,
  billingFastifyPlugin,
  db,
} from "server-core";
import type { FastifyInstance } from "fastify";

const build = await createServer([
  // Always register the DB first
  [
    postgresFastifyPlugin,
    {
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOSTNAME,
      port: parseInt(process.env.POSTGRES_PORT || "5432"),
    },
  ],

  // Register the session handler second. Always register this after the DB
  // since the session handler uses postgres internally
  [sessionFastifyPlugin, {}],

  // Order of these plugins doesn't matter as much - just that they come last
  [analyticsFastifyPlugin, {}],
  [emailFastifyPlugin, {}],
  [billingFastifyPlugin, {}],
]);
const server: FastifyInstance = build.server;
const wsGateway = build.wsGateway;
const healthCheck = build.healthCheck;

let interval: NodeJS.Timeout | null = null;

const BUILD_VERSION = process.env.BUILD_VERSION || "unknown";

const port = Number(process.env.PORT) || 8080;

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const host = IS_PRODUCTION ? "0.0.0.0" : "localhost";

process.on("SIGTERM", async () => {
  if (process.env.NODE_ENV === "development") {
    console.log("Received SIGTERM in development. Ignoring...");
    process.exit(0);
  }

  console.log(
    BUILD_VERSION
      ? `Received SIGTERM for deploy: ${BUILD_VERSION}. Shutting down gracefully...`
      : "Received SIGTERM. Shutting down gracefully..."
  );

  if (interval) {
    clearInterval(interval);
  }

  // Set the health check to false to start returning 503s.
  // The load balancer should mark the server as unhealthy within 25 seconds
  // since it waits for 4 consecutive failures and checks every 5 seconds.
  healthCheck.healthy = false;

  // Wait 18 seconds, then close websocket connections. They'll reconnect after
  // 10 seconds, which should be past the load balancer's health check interval.
  await new Promise((resolve) => {
    setTimeout(async () => {
      console.log("Closing websocket connections.");
      await wsGateway.handleSigterm();
      resolve(true);
    }, 18000);
  });

  // Next, wait another 10 seconds (28 seconds after SIGTERM), then shut down
  // the server entirely.
  setTimeout(async () => {
    await server.close();

    console.log(
      BUILD_VERSION
        ? `Server was shut down gracefully for deploy: ${BUILD_VERSION}. Goodbye.`
        : "Server was shut down gracefully. Goodbye."
    );

    process.exit(0);
  }, 10000);
});

server.listen({ port, host }, async (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  if (IS_PRODUCTION) {
    const activeDeploy = await db.deploy.insert(server.pg, BUILD_VERSION);

    const checkForNewDeploy = async () => {
      const latestDeploy = await db.deploy.selectMostRecent(server.pg);

      if (
        latestDeploy.createdAt.getTime() > activeDeploy.createdAt.getTime() &&
        latestDeploy.deployId !== activeDeploy.deployId
      ) {
        console.log(
          `Detected new deploy: ${latestDeploy.deployId}. Current deploy: ${activeDeploy.deployId}. Sending SIGTERM...`
        );

        process.kill(process.pid, "SIGTERM");
      }
    };

    interval = setInterval(checkForNewDeploy, 10000);
  }

  console.log(`Server listening at ${address}`);
});
