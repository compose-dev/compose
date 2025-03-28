import { m, u } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { db } from "../../models";

/**
 * Will conditionally decrement the external seat count in the billing service
 * based on the type of external app user.
 * @param server the fastify server instance
 * @param externalAppUser the external app user to decrement the seat count for
 * @param companyId the company id of the company that the external app user belongs to
 */
async function maybeDecrementExternalSeatCountInBilling(
  server: FastifyInstance,
  externalAppUser: m.ExternalAppUser.DB,
  companyId: m.Company.DB["id"]
) {
  const isEmail =
    u.string.isValidEmail(externalAppUser.email) &&
    externalAppUser.email !==
      m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP &&
    !externalAppUser.email.startsWith(
      m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX
    );

  // Only decrement the external seat count when an app is shared with a
  // specific email, as opposed to making it public.
  if (isEmail) {
    const company = await db.company.selectById(server.pg, companyId);
    const customerBilling = await server.billing.fetchCustomer(
      server,
      company,
      server.pg
    );

    await customerBilling.updateSubscriptionExternalSeatQuantity(
      customerBilling.externalSeatsUsed - 1
    );
  }
}

export { maybeDecrementExternalSeatCountInBilling };
