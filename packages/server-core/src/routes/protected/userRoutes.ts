import { BrowserToServerEvent, m, u } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { db } from "../../models";
import { apiKeyService } from "../../services/apiKey";

async function userRoutes(server: FastifyInstance) {
  // Change a user's permission
  server.put<{ Params: { userId: string } }>(
    `/${BrowserToServerEvent.ChangeUserPermission.route}`,
    async (req, reply) => {
      const { userId: targetUserId } = req.params;

      const body =
        req.body as BrowserToServerEvent.ChangeUserPermission.RequestBody;

      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const dbUser = await db.user.selectById(server.pg, user.id);

      if (!dbUser) {
        return reply.status(400).send({ message: "User not found" });
      }

      const targetUser = await db.user.selectById(server.pg, targetUserId);

      if (!targetUser) {
        return reply.status(400).send({ message: "Target user not found" });
      }

      if (targetUser.companyId !== user.companyId) {
        return reply.status(403).send({ message: "Forbidden" });
      }

      if (targetUser.permission === body.newPermission) {
        return reply.status(400).send({
          message: "New permission is the same as the current permission.",
        });
      }

      const { add, remove } = u.permission.isAllowedToChangePermission({
        actingUserPermission: dbUser.permission,
        oldPermission: targetUser.permission,
        newPermission: body.newPermission,
      });

      if (!add) {
        return reply.status(403).send({
          message: `Forbidden. You are not authorized to add ${body.newPermission} permission.`,
        });
      }

      if (!remove) {
        return reply.status(403).send({
          message: `Forbidden. You are not authorized to remove ${targetUser.permission} permission.`,
        });
      }

      if (targetUser.permission === m.User.PERMISSION.OWNER) {
        const currentOwners = await db.user.selectAllByCompanyIdAndPermission(
          server.pg,
          user.companyId,
          m.User.PERMISSION.OWNER
        );

        if (currentOwners.length === 1) {
          return reply.status(400).send({
            message: "Cannot remove the only owner.",
          });
        }
      }

      const updatedUser = await db.user.updatePermission(
        server.pg,
        targetUser.id,
        body.newPermission
      );

      const response: BrowserToServerEvent.ChangeUserPermission.Response = {
        updatedUser,
      };

      reply.status(200).send(response);
    }
  );

  // Delete a user
  server.delete<{ Params: { userId: string } }>(
    `/${BrowserToServerEvent.DeleteUser.route}`,
    async (req, reply) => {
      const { userId: targetUserId } = req.params;

      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const dbUser = await db.user.selectById(server.pg, user.id);

      if (!dbUser) {
        return reply.status(400).send({ message: "User not found" });
      }

      const targetUser = await db.user.selectById(server.pg, targetUserId);

      if (!targetUser) {
        return reply.status(400).send({ message: "Target user not found" });
      }

      if (targetUser.companyId !== user.companyId) {
        return reply.status(403).send({ message: "Forbidden" });
      }

      if (targetUser.id === user.id) {
        return reply.status(400).send({
          message: "Cannot delete yourself.",
        });
      }

      if (
        !u.permission.isAllowedToDeleteUser({
          actingUserPermission: dbUser.permission,
          targetUserPermission: targetUser.permission,
        })
      ) {
        return reply.status(403).send({
          message: `Forbidden. You are not authorized to delete this user.`,
        });
      }

      if (targetUser.permission === m.User.PERMISSION.OWNER) {
        const currentOwners = await db.user.selectAllByCompanyIdAndPermission(
          server.pg,
          user.companyId,
          m.User.PERMISSION.OWNER
        );

        if (currentOwners.length === 1) {
          return reply.status(400).send({
            message: "Cannot delete the only owner.",
          });
        }
      }

      const company = await db.company.selectById(server.pg, user.companyId);

      // ALWAYS GENERATE THE CUSTOMER BILLING OBJECT BEFORE DELETING THE USER.
      // Upon generation, the billing class will fetch the current number of
      // standard seats based on the users table. If we delete the user before
      // generating the billing class, the billing class will incorrectly
      // calculate the current seat count as one less than the actual number.
      const customerBilling = await server.billing.fetchCustomer(
        server,
        company,
        server.pg
      );

      await db.user.deleteById(server.pg, targetUser.id, user.companyId);

      if (targetUser.developmentEnvironmentId) {
        await db.environment.deleteById(
          server.pg,
          targetUser.developmentEnvironmentId,
          user.companyId
        );
      }

      await customerBilling.updateSubscriptionStandardSeatQuantity(
        customerBilling.standardSeatsUsed - 1
      );

      const response: BrowserToServerEvent.DeleteUser.Response = {};

      reply.status(200).send(response);
    }
  );

  server.get(
    `/${BrowserToServerEvent.GetDevEnvironment.route}`,
    async (req, reply) => {
      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const dbUser = await db.user.selectById(server.pg, user.id);

      if (!dbUser) {
        return reply.status(400).send({ message: "User not found" });
      }

      if (!dbUser.developmentEnvironmentId) {
        return reply.status(200).send({ environments: [] });
      }

      const devEnvironment = await db.environment.selectByIdWithDecryptableKey(
        server.pg,
        dbUser.developmentEnvironmentId
      );

      if (!devEnvironment || !devEnvironment.decryptableKey) {
        return reply.status(400).send({
          message: "Development environment not found",
        });
      }

      const decryptedKey = await apiKeyService.decryptTwoWayHash(
        devEnvironment.decryptableKey
      );

      const response: BrowserToServerEvent.GetDevEnvironment.Response = {
        environments: [{ ...devEnvironment, decryptableKey: decryptedKey }],
      };

      reply.status(200).send(response);
    }
  );
}

export { userRoutes };
