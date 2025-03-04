import { BrowserToServerEvent, m, u } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { db } from "../../models";

async function externalAppUserRoutes(server: FastifyInstance) {
  // Insert an external app user
  server.post(
    `/${BrowserToServerEvent.InsertExternalAppUser.route}`,
    async (req, reply) => {
      const body =
        req.body as BrowserToServerEvent.InsertExternalAppUser.RequestBody;

      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const dbUser = await db.user.selectById(server.pg, user.id);

      if (!dbUser) {
        return reply.status(400).send({ message: "User not found" });
      }

      if (dbUser.email === body.email) {
        return reply.status(400).send({
          message:
            "You cannot share the app with yourself. You already have access to this app.",
        });
      }

      if (
        !u.permission.isAllowed(
          u.permission.FEATURE.SHARE_APP_EXTERNAL_EMAIL,
          dbUser.permission
        )
      ) {
        return reply.status(403).send({
          message:
            "Forbidden. You are not authorized to share this app with external users.",
        });
      }

      const environment = await db.environment.selectById(
        server.pg,
        body.environmentId
      );

      if (!environment) {
        return reply
          .status(400)
          .send({ message: "Environment not found for this app." });
      }

      const companyUsers = await db.user.selectByCompanyId(
        server.pg,
        user.companyId
      );

      const sharedWithCompanyUser = companyUsers.find(
        (user) => user.email === body.email
      );

      if (
        environment.type === m.Environment.TYPE.prod &&
        sharedWithCompanyUser
      ) {
        return reply.status(400).send({
          message:
            "This user is part of your organization, and thus already has access to this app!",
        });
      }

      const existingExternalUsers =
        await db.externalAppUser.selectByAppRouteAndEnvironmentId(
          server.pg,
          body.appRoute,
          body.environmentId
        );

      const alreadyExists = existingExternalUsers.find(
        (permission) => permission.email === body.email
      );

      if (alreadyExists) {
        return reply.status(400).send({
          message: `This app has already been shared with ${body.email}`,
        });
      }

      const isEmail =
        u.string.isValidEmail(body.email) &&
        body.email !== m.ExternalAppUser.EMAIL_FIELD_VALUE_FOR_PUBLIC_APP &&
        !body.email.startsWith(
          m.ExternalAppUser.INHERIT_PERMISSIONS_FROM_APP_PREFIX
        );

      // Only increment the external seat count when an app is shared with a
      // specific email, as opposed to making it public.
      if (isEmail) {
        const company = await db.company.selectById(server.pg, user.companyId);
        const customerBilling = await server.billing.fetchCustomer(
          server,
          company,
          server.pg
        );

        if (customerBilling.externalSeatsRemaining <= 0) {
          await customerBilling.updateSubscriptionExternalSeatQuantity(
            customerBilling.externalSeatsUsed + 1
          );
        }
      }

      await db.externalAppUser.insert(
        server.pg,
        user.companyId,
        body.email,
        body.environmentId,
        user.id,
        body.appRoute
      );

      reply.status(200).send({});
    }
  );

  // Get external app users
  server.post(
    `/${BrowserToServerEvent.GetExternalAppUsers.route}`,
    async (req, reply) => {
      const body =
        req.body as BrowserToServerEvent.GetExternalAppUsers.RequestBody;

      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const externalAppUsers =
        await db.externalAppUser.selectByAppRouteAndEnvironmentId(
          server.pg,
          body.appRoute,
          body.environmentId
        );

      reply.status(200).send(externalAppUsers);
    }
  );

  // Delete an external app user
  server.delete<{ Params: { id: string } }>(
    `/${BrowserToServerEvent.DeleteExternalAppUser.route}`,
    async (req, reply) => {
      const { id } = req.params;

      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      if (!id) {
        return reply.status(400).send({ message: "Id is required" });
      }

      const dbUser = await db.user.selectById(server.pg, user.id);

      if (!dbUser) {
        return reply.status(400).send({ message: "User not found" });
      }

      if (
        !u.permission.isAllowed(
          u.permission.FEATURE.UNSHARE_APP_EXTERNAL_EMAIL,
          dbUser.permission
        )
      ) {
        return reply.status(403).send({
          message:
            "Forbidden. You are not authorized to remove external users.",
        });
      }

      const externalAppUser = await db.externalAppUser.selectById(
        server.pg,
        id
      );

      if (!externalAppUser) {
        return reply.status(400).send({ message: "Not found" });
      }

      if (externalAppUser.companyId !== user.companyId) {
        return reply.status(403).send({ message: "Forbidden" });
      }

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
        const company = await db.company.selectById(server.pg, user.companyId);
        const customerBilling = await server.billing.fetchCustomer(
          server,
          company,
          server.pg
        );

        await customerBilling.updateSubscriptionExternalSeatQuantity(
          customerBilling.externalSeatsUsed - 1
        );
      }

      await db.externalAppUser.deleteById(server.pg, id);

      reply.status(200).send({});
    }
  );
}

export { externalAppUserRoutes };
