import { m } from "@compose/ts";

import { db } from "../../models";
import { Postgres } from "../postgres";

const THREE_DAYS_IN_MS = 1000 * 60 * 60 * 24 * 3;

/**
 * Generate an email code. Returns the email code object.
 */
async function generate(
  pg: Postgres,
  companyId: string,
  email: string,
  expiresAt: Date,
  metadata: m.EmailCode.DB["metadata"]
) {
  const emailCode = await db.emailCode.insert(
    pg,
    companyId,
    email,
    expiresAt,
    metadata
  );

  return emailCode;
}

async function generateInviteCode(
  pg: Postgres,
  companyId: string,
  email: string,
  accountType: m.User.AccountType,
  permission: m.User.Permission
) {
  const metadata: m.EmailCode.DB["metadata"] = {
    purpose: m.EmailCode.PURPOSE.JOIN_COMPANY,
    accountType,
    permission,
  };

  const threeDaysFromNow = new Date(Date.now() + THREE_DAYS_IN_MS);

  return generate(pg, companyId, email, threeDaysFromNow, metadata);
}

export { generateInviteCode };
