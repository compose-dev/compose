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
      "5xx": BrowserToServerEvent.GetCustomLogEvents.ErrorResponseBody;
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
        if (!req.body.reportId) {
          return reply.status(403).send({
            message:
              "You don't have permission to view this report. Please ask your administrator to grant you access.",
            type: "invalid-user-permission",
          });
        }

        const report = await db.report.selectById(
          server.pg,
          req.body.reportId,
          dbUser.companyId
        );

        if (!report) {
          return reply.status(404).send({
            message: "Report not found.",
            type: "unknown-error",
          });
        }

        const reportUser = await db.reportUser.selectByUserIdAndReportId(
          server.pg,
          dbUser.id,
          req.body.reportId,
          dbUser.companyId
        );

        if (!reportUser || !reportUser.permission.canView) {
          return reply.status(403).send({
            message:
              "You don't have permission to view this report. Please ask your administrator to grant you access.",
            type: "invalid-user-permission",
          });
        }

        try {
          d.report.validateLogsRequestAgainstReportConfiguration(
            report,
            req.body.timeFrame,
            req.body.dateRange,
            req.body.includeProductionLogs,
            req.body.includeDevelopmentLogs,
            req.body.apps,
            req.body.trackedEventModel,
            req.body.selectedUserEmails,
            req.body.includeAnonymousUsers
          );
        } catch (error) {
          return reply.status(400).send({
            message: (error as Error).message,
            type: "unknown-error",
          });
        }
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
      const trackedEvents = m.Report.getTrackedEventRules(
        req.body.trackedEventModel
      );

      if (trackedEvents.length === 0) {
        reply.status(200).send({
          groupedLogs: [],
        });
      }

      const now = new Date();

      // Calculate datetime start and end on backend to ensure a
      // user with view-only access to a report doesn't pass
      // an accepted timeframe but then give a different date range.
      const datetimeStart =
        req.body.timeFrame === m.Report.TIMEFRAMES.CUSTOM
          ? req.body.dateRange.start
          : m.Report.TIMEFRAME_TO_START_DATE[req.body.timeFrame](now);

      const datetimeEnd =
        req.body.timeFrame === m.Report.TIMEFRAMES.CUSTOM
          ? req.body.dateRange.end
          : m.Report.TIMEFRAME_TO_END_DATE[req.body.timeFrame](now);

      if (!datetimeStart || !datetimeEnd) {
        return reply.status(500).send({
          message:
            "Internal server error. Expected a date but got null for datetimeStart or datetimeEnd.",
          type: "unknown-error",
        });
      }

      const queryStart = performance.now();

      const logs = await db.log.selectGroupedLogCounts(
        server.pg,
        dbUser.companyId,
        datetimeStart,
        datetimeEnd,
        environmentTypes,
        req.body.apps,
        trackedEvents,
        req.body.selectedUserEmails,
        req.body.includeAnonymousUsers
      );

      const queryEnd = performance.now();

      server.analytics.capture(
        server.analytics.event.REPORT_GROUPED_LOGS_DATABASE_QUERY_OCCURRED,
        dbUser.id,
        dbUser.companyId,
        {
          queryTimeMs: queryEnd - queryStart,
          datetimeStart: datetimeStart,
          datetimeEnd: datetimeEnd,
          environmentTypes: environmentTypes,
          apps: req.body.apps,
          trackedEvents: trackedEvents,
          selectedUserEmails: req.body.selectedUserEmails,
          includeAnonymousUsers: req.body.includeAnonymousUsers,
        }
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
