import { createServer } from "./createServer";
import { d } from "./domain";
import { db } from "./models";
import { WSGateway } from "./routes/ws";
import { analyticsFastifyPlugin, AnalyticsService } from "./services/analytics";
import { apiKeyService } from "./services/apiKey";
import { sessionFastifyPlugin } from "./services/auth-sessions";
import {
  billingFastifyPlugin,
  BillingGatewayService,
  CustomerBillingService,
} from "./services/billing";
import {
  emailFastifyPlugin,
  EmailService,
  EmailServiceCreateContactResponse,
  EmailServiceUpdateContactResponse,
  EmailServiceFindContactResponse,
} from "./services/email";
import { postgresFastifyPlugin } from "./services/postgres";
import {
  FastifyRequestExtensions,
  FastifyInstanceExtensions,
} from "./types/fastifyExtensions";
import { createPlugin } from "./utils/plugin";

export {
  // Create a server instance
  createServer,

  // Plugins
  postgresFastifyPlugin,
  sessionFastifyPlugin,
  analyticsFastifyPlugin,
  emailFastifyPlugin,
  billingFastifyPlugin,

  // Models
  db,

  // Types
  type WSGateway,
  type FastifyRequestExtensions,
  type FastifyInstanceExtensions,

  // Services
  AnalyticsService,
  EmailService,
  BillingGatewayService,
  CustomerBillingService,
  apiKeyService,
  createPlugin,

  // Domain
  d,

  // Types
  type EmailServiceCreateContactResponse,
  type EmailServiceUpdateContactResponse,
  type EmailServiceFindContactResponse,
};
