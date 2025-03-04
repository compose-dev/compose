import { BrowserToServerEvent, u } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { db } from "../../models";

async function billingRoutes(server: FastifyInstance) {
  // Create a checkout session
  server.post(
    `/${BrowserToServerEvent.CreateCheckoutSession.route}`,
    async (req, reply) => {
      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const dbUser = await db.user.selectById(server.pg, user.id);

      if (!dbUser) {
        return reply.status(400).send({ message: "User not found" });
      }

      if (
        !u.permission.isAllowed(
          u.permission.FEATURE.CHANGE_BILLING,
          dbUser.permission
        )
      ) {
        return reply.status(403).send({
          message: "Forbidden. You are not authorized to change billing.",
        });
      }

      const body =
        req.body as BrowserToServerEvent.CreateCheckoutSession.RequestBody;

      const company = await db.company.selectById(server.pg, user.companyId);
      const customerBilling = await server.billing.fetchCustomer(
        server,
        company,
        server.pg
      );

      const session = await customerBilling.createUpgradeToProCheckoutSession(
        body.standardSeats,
        body.externalSeats,
        body.cancelUrl,
        body.successUrl
      );

      reply.status(200).send({ checkoutUrl: session.url });
    }
  );

  // Get billing details
  server.get(
    `/${BrowserToServerEvent.BillingDetails.route}`,
    async (req, reply) => {
      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const dbUser = await db.user.selectById(server.pg, user.id);

      if (!dbUser) {
        return reply.status(400).send({ message: "User not found" });
      }

      const company = await db.company.selectById(server.pg, user.companyId);

      if (!company) {
        throw new Error("Company not found");
      }

      // if (
      //   !u.permission.isAllowed(
      //     u.permission.FEATURE.VIEW_BILLING,
      //     dbUser.permission
      //   )
      // ) {
      //   // Send a fake response for now so it doesn't crash the settings page.
      //   // But, it's all good since the data is incorrect!
      //   const response: BrowserToServerEvent.BillingDetails.Response = {
      //     company,
      //     standardSeats: 100000,
      //     externalSeats: 100000,
      //     standardSeatsUsed: 100000,
      //     externalSeatsUsed: 100000,
      //     FREE_UNLIMITED_USAGE: false,
      //     allowInvitingStandardUsers: true,
      //     allowInvitingExternalUsers: true,
      //   };
      //   return reply.status(200).send(response);
      // }

      const customerBilling = await server.billing.fetchCustomer(
        server,
        company,
        server.pg
      );

      await customerBilling.syncBillingWithDB();
      const updatedCompany = await db.company.selectById(
        server.pg,
        user.companyId
      );

      reply.status(200).send({
        company: updatedCompany,
        standardSeats: customerBilling.standardSeatAllowance,
        externalSeats: customerBilling.externalSeatAllowance,
        standardSeatsUsed: customerBilling.standardSeatsUsed,
        externalSeatsUsed: customerBilling.externalSeatsUsed,
        FREE_UNLIMITED_USAGE: customerBilling.hasFreeUnlimitedUsage,
        allowInvitingStandardUsers:
          customerBilling.hasFreeUnlimitedUsage ||
          customerBilling.hasProSubscription,
        allowInvitingExternalUsers:
          customerBilling.hasFreeUnlimitedUsage ||
          customerBilling.hasProSubscription,
      });
    }
  );
}

export { billingRoutes };
