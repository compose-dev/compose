import { BrowserToServerEvent, m, u } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { db } from "../../models";

async function auditLogRoutes(server: FastifyInstance) {
  // Fetch a page of audit logs
  server.post<{
    Body: BrowserToServerEvent.GetPageOfLogs.RequestBody;
    Reply: BrowserToServerEvent.GetPageOfLogs.ResponseBody;
  }>(`/${BrowserToServerEvent.GetPageOfLogs.route}`, async (req, reply) => {
    const user = req.user;

    if (!user || user.isExternal) {
      return reply
        .status(401)
        .send({ message: "Unauthorized", type: "unknown-error" });
    }

    const company = await db.company.selectById(server.pg, user.companyId);

    if (!company) {
      return reply
        .status(400)
        .send({ message: "Company not found", type: "unknown-error" });
    }

    if (company.plan === m.Company.PLANS.HOBBY) {
      return reply.status(400).send({
        message: "Hobby plan does not support audit logs.",
        type: "invalid-plan",
      });
    }

    const dbUser = await db.user.selectById(server.pg, user.id);

    if (!dbUser) {
      return reply
        .status(400)
        .send({ message: "User not found", type: "unknown-error" });
    }

    if (
      !u.permission.isAllowed(
        u.permission.FEATURE.VIEW_AUDIT_LOGS,
        dbUser.permission
      )
    ) {
      return reply.status(403).send({
        message:
          "Only users with admin permissions can view audit logs. Please ask your administrator to enable this feature for you.",
        type: "invalid-user-permission",
      });
    }

    const logs = await db.log.selectPage(
      server.pg,
      dbUser.companyId,
      req.body.limit,
      req.body.offset,
      req.body.appRoute,
      req.body.userEmail,
      req.body.severity ?? [],
      req.body.datetimeStart,
      req.body.datetimeEnd,
      req.body.message,
      req.body.type
    );

    const totalRecords =
      logs.length < req.body.limit ? logs.length + req.body.offset : Infinity;

    reply.status(200).send({
      logs: logs,
      totalRecords: totalRecords,
    });
  });
}

export { auditLogRoutes };
