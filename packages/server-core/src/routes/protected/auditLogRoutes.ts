import { BrowserToServerEvent, m, u } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { d } from "../../domain";
import { db } from "../../models";

async function auditLogRoutes(server: FastifyInstance) {
  // Fetch a page of audit logs
  server.post<{
    Body: BrowserToServerEvent.GetPageOfLogs.RequestBody;
    Reply: {
      200: BrowserToServerEvent.GetPageOfLogs.SuccessResponseBody;
      "4xx": BrowserToServerEvent.GetPageOfLogs.ErrorResponseBody;
    };
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
          "Only users with admin permissions can view activity logs. Please ask your administrator to enable this feature for you.",
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

  server.post<{
    Body: BrowserToServerEvent.GetCustomLogEvents.RequestBody;
    Reply: {
      200: BrowserToServerEvent.GetCustomLogEvents.SuccessResponseBody;
      "4xx": BrowserToServerEvent.GetCustomLogEvents.ErrorResponseBody;
    };
  }>(
    `/${BrowserToServerEvent.GetCustomLogEvents.route}`,
    async (req, reply) => {
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
            "Only users with admin permissions can view activity logs. Please ask your administrator to enable this feature for you.",
          type: "invalid-user-permission",
        });
      }

      const environmentTypes = [
        ...(req.body.includeDevelopmentLogs ? [m.Environment.TYPE.dev] : []),
        ...(req.body.includeProductionLogs ? [m.Environment.TYPE.prod] : []),
      ];

      if (environmentTypes.length === 0) {
        reply.status(200).send({
          groupedLogs: [],
        });
      }

      // Validate that the model follows the simplified structure.
      // If so, we can reliably extract the events.
      d.report.validateSimplifiedTrackedEventModel(req.body.trackedEventModel);
      const trackedEvents = (
        req.body.trackedEventModel as m.Report.TrackedEventGroup
      ).events as m.Report.TrackedEventRule[];

      if (trackedEvents.length === 0) {
        reply.status(200).send({
          groupedLogs: [],
        });
      }

      const logs = await db.log.selectGroupedLogCounts(
        server.pg,
        dbUser.companyId,
        req.body.datetimeStart,
        req.body.datetimeEnd,
        environmentTypes,
        req.body.apps,
        trackedEvents
      );

      reply.status(200).send({
        groupedLogs: logs,
      });
    }
  );

  server.post<{
    Body: BrowserToServerEvent.GetDistinctLogMessages.RequestBody;
    Reply: {
      200: BrowserToServerEvent.GetDistinctLogMessages.SuccessResponseBody;
      "4xx": BrowserToServerEvent.GetDistinctLogMessages.ErrorResponseBody;
    };
  }>(
    `/${BrowserToServerEvent.GetDistinctLogMessages.route}`,
    async (req, reply) => {
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
            "Only users with admin permissions can view activity logs. Please ask your administrator to enable this feature for you.",
          type: "invalid-user-permission",
        });
      }

      const logs = await db.log.selectDistinctLogMessages(
        server.pg,
        dbUser.companyId
      );

      reply.status(200).send({
        distinctLogMessages: logs,
      });
    }
  );
}

export { auditLogRoutes };
