import { m } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { db } from "../../models";

async function insert(
  server: FastifyInstance,
  companyName: m.Company.DB["name"],
  plan: m.Company.DB["plan"],
  billingId: m.Company.DB["billingId"],
  flags: m.Company.DB["flags"]
) {
  const company = await db.company.insert(
    server.pg,
    companyName,
    plan,
    billingId,
    flags
  );

  server.analytics.capture(
    server.analytics.event.COMPANY_CREATED,
    // This is a group event, hence we use the group id as the distinct id.
    company.id,
    company.id,
    {
      companyName,
      plan,
    }
  );

  server.analytics.identifyCompany(company.id, company.name);

  return company;
}

export { insert };
