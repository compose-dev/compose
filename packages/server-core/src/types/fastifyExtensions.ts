import { AnalyticsServiceStub } from "../services/analytics";
import { Session } from "../services/auth-sessions";
import {
  BillingGatewayServiceStub,
  CustomerBillingServiceStub,
} from "../services/billing";
import { EmailServiceStub } from "../services/email";
import { Postgres } from "../services/postgres";
interface FastifyInstanceExtensions {
  analytics: AnalyticsServiceStub;
  email: EmailServiceStub;
  pg: Postgres;
  session: Session;
  billing: {
    gateway: BillingGatewayServiceStub;
    fetchCustomer: typeof CustomerBillingServiceStub.create;
  };
}

interface FastifyRequestExtensions {
  user?:
    | {
        id: string;
        companyId: string;
        email: string;
        isExternal: false;
      }
    | {
        id: null;
        companyId: null;
        email: string;
        isExternal: true;
      };
}

export type { FastifyInstanceExtensions, FastifyRequestExtensions };
