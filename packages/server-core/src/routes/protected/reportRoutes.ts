import { BrowserToServerEvent, m, u } from "@compose/ts";
import { FastifyInstance } from "fastify";

import { d } from "../../domain";
import { db } from "../../models";

async function reportRoutes(server: FastifyInstance) {
  server.post<{
    Body: BrowserToServerEvent.CreateReport.RequestBody;
    Reply: {
      200: BrowserToServerEvent.CreateReport.SuccessResponseBody;
      "4xx": BrowserToServerEvent.CreateReport.ErrorResponseBody;
    };
  }>(`/${BrowserToServerEvent.CreateReport.route}`, async (req, reply) => {
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
        u.permission.FEATURE.CREATE_REPORT,
        dbUser.permission
      )
    ) {
      return reply.status(403).send({ message: "Forbidden" });
    }

    if (!req.body.title || req.body.title.length < 2) {
      return reply
        .status(400)
        .send({ message: "Report title must be at least 2 characters long" });
    }

    const report = await db.report.insert(
      server.pg,
      dbUser.companyId,
      req.body.title,
      req.body.description,
      req.body.data,
      user.id,
      user.id
    );

    d.report.captureReportEventInAnalytics(
      server,
      dbUser,
      server.analytics.event.REPORT_CREATED,
      report
    );

    return reply.status(200).send({ reportId: report.id });
  });

  server.get<{
    Params: BrowserToServerEvent.GetReport.RequestParams;
    Reply: {
      200: BrowserToServerEvent.GetReport.SuccessResponseBody;
      "4xx": BrowserToServerEvent.GetReport.ErrorResponseBody;
    };
  }>(`/${BrowserToServerEvent.GetReport.route}`, async (req, reply) => {
    const user = req.user;

    if (!user || user.isExternal) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const dbUser = await db.user.selectById(server.pg, user.id);

    if (!dbUser) {
      return reply.status(400).send({ message: "User not found" });
    }

    const reportId = req.params.reportId;

    if (!reportId) {
      return reply.status(400).send({ message: "Report ID is required" });
    }

    if (
      !u.permission.isAllowed(
        u.permission.FEATURE.VIEW_REPORT,
        dbUser.permission
      )
    ) {
      const reportUser = await db.reportUser.selectByUserIdAndReportId(
        server.pg,
        dbUser.id,
        reportId,
        dbUser.companyId
      );

      if (!reportUser || !reportUser.permission.canView) {
        return reply.status(403).send({ message: "Forbidden" });
      }
    }

    const report = await db.report.selectById(
      server.pg,
      reportId,
      dbUser.companyId
    );

    if (!report) {
      return reply.status(404).send({ message: "Report not found" });
    }

    return reply.status(200).send({ report });
  });

  server.get<{
    Reply: {
      200: BrowserToServerEvent.GetReports.SuccessResponseBody;
      "4xx": BrowserToServerEvent.GetReports.ErrorResponseBody;
    };
  }>(`/${BrowserToServerEvent.GetReports.route}`, async (req, reply) => {
    const user = req.user;

    if (!user || user.isExternal) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const dbUser = await db.user.selectById(server.pg, user.id);

    if (!dbUser) {
      return reply.status(400).send({ message: "User not found" });
    }

    let reports: m.Report.DB[] = [];

    if (
      u.permission.isAllowed(
        u.permission.FEATURE.VIEW_LIST_OF_REPORTS,
        dbUser.permission
      )
    ) {
      reports = await db.report.selectByCompanyId(server.pg, dbUser.companyId);
    } else {
      reports = await db.report.selectFilteredByReportUser(
        server.pg,
        dbUser.companyId,
        dbUser.id
      );

      if (reports.length === 0) {
        return reply.status(400).send({
          message:
            "You don't have permission to view any reports. Please contact your administrator.",
        });
      }
    }

    return reply.status(200).send({ reports });
  });

  server.delete<{
    Params: BrowserToServerEvent.DeleteReport.RequestParams;
    Reply: {
      200: BrowserToServerEvent.DeleteReport.SuccessResponseBody;
      "4xx": BrowserToServerEvent.DeleteReport.ErrorResponseBody;
    };
  }>(`/${BrowserToServerEvent.DeleteReport.route}`, async (req, reply) => {
    const user = req.user;

    if (!user || user.isExternal) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const dbUser = await db.user.selectById(server.pg, user.id);

    if (!dbUser) {
      return reply.status(400).send({ message: "User not found" });
    }

    const reportId = req.params.reportId;

    if (!reportId) {
      return reply.status(400).send({ message: "Report ID is required" });
    }

    if (
      !u.permission.isAllowed(
        u.permission.FEATURE.DELETE_REPORT,
        dbUser.permission
      )
    ) {
      return reply.status(403).send({ message: "Forbidden" });
    }

    const report = await db.report.selectById(
      server.pg,
      reportId,
      dbUser.companyId
    );

    if (!report) {
      return reply.status(404).send({ message: "Report not found" });
    }

    await db.report.deleteById(server.pg, reportId, dbUser.companyId);

    d.report.captureReportEventInAnalytics(
      server,
      dbUser,
      server.analytics.event.REPORT_DELETED,
      report
    );

    return reply.status(200).send({ success: true });
  });

  server.put<{
    Params: BrowserToServerEvent.UpdateReport.RequestParams;
    Body: BrowserToServerEvent.UpdateReport.RequestBody;
    Reply: {
      200: BrowserToServerEvent.UpdateReport.SuccessResponseBody;
      "4xx": BrowserToServerEvent.UpdateReport.ErrorResponseBody;
    };
  }>(`/${BrowserToServerEvent.UpdateReport.route}`, async (req, reply) => {
    const user = req.user;

    if (!user || user.isExternal) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const reportId = req.params.reportId;

    if (!reportId) {
      return reply.status(400).send({ message: "Report ID is required" });
    }

    const dbUser = await db.user.selectById(server.pg, user.id);

    if (!dbUser) {
      return reply.status(400).send({ message: "User not found" });
    }

    if (
      !u.permission.isAllowed(
        u.permission.FEATURE.UPDATE_REPORT,
        dbUser.permission
      )
    ) {
      return reply.status(403).send({ message: "Forbidden" });
    }

    const report = await db.report.update(
      server.pg,
      reportId,
      dbUser.companyId,
      req.body.title,
      req.body.description,
      req.body.data,
      user.id
    );

    d.report.captureReportEventInAnalytics(
      server,
      dbUser,
      server.analytics.event.REPORT_UPDATED,
      report
    );

    return reply.status(200).send({ report });
  });

  server.post<{
    Params: BrowserToServerEvent.ShareReport.RequestParams;
    Reply: {
      200: BrowserToServerEvent.ShareReport.SuccessResponseBody;
      "4xx": BrowserToServerEvent.ShareReport.ErrorResponseBody;
    };
  }>(`/${BrowserToServerEvent.ShareReport.route}`, async (req, reply) => {
    const user = req.user;

    if (!user || user.isExternal) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const { userId, reportId } = req.params;

    if (!userId) {
      return reply.status(400).send({ message: "User ID is required" });
    }

    if (!reportId) {
      return reply.status(400).send({ message: "Report ID is required" });
    }

    const dbUser = await db.user.selectById(server.pg, user.id);

    if (!dbUser) {
      return reply.status(400).send({ message: "User not found" });
    }

    if (
      !u.permission.isAllowed(
        u.permission.FEATURE.SHARE_REPORT_WITH_USER,
        dbUser.permission
      )
    ) {
      return reply.status(403).send({ message: "Forbidden" });
    }

    const dbUserToShareWith = await db.user.selectById(server.pg, userId);

    if (!dbUserToShareWith) {
      return reply
        .status(400)
        .send({ message: "User to share with not found" });
    }

    if (dbUserToShareWith.companyId !== dbUser.companyId) {
      return reply
        .status(400)
        .send({ message: "User to share with is not in the same company" });
    }

    if (dbUserToShareWith.id === dbUser.id) {
      return reply
        .status(400)
        .send({ message: "Cannot share report with yourself" });
    }

    if (
      u.permission.isAllowed(
        u.permission.FEATURE.VIEW_REPORT,
        dbUserToShareWith.permission
      )
    ) {
      return reply.status(400).send({
        message:
          "User already has sufficient permissions via their role to view this report. No need to share.",
      });
    }

    const report = await db.report.selectById(
      server.pg,
      reportId,
      dbUser.companyId
    );

    if (!report) {
      return reply.status(404).send({ message: "Report not found" });
    }

    const reportUser = await db.reportUser.selectByUserIdAndReportId(
      server.pg,
      dbUserToShareWith.id,
      reportId,
      dbUser.companyId
    );

    if (reportUser) {
      return reply
        .status(400)
        .send({ message: "Report already shared with user" });
    }

    await db.reportUser.insert(
      server.pg,
      reportId,
      dbUser.companyId,
      dbUser.id,
      dbUserToShareWith.id,
      {
        canView: true,
      }
    );

    d.report.captureReportShareEventInAnalytics(
      server,
      dbUser,
      dbUserToShareWith,
      server.analytics.event.REPORT_SHARED,
      report
    );

    return reply.status(200).send({ success: true });
  });

  server.delete<{
    Params: BrowserToServerEvent.UnshareReport.RequestParams;
    Reply: {
      200: BrowserToServerEvent.UnshareReport.SuccessResponseBody;
      "4xx": BrowserToServerEvent.UnshareReport.ErrorResponseBody;
    };
  }>(`/${BrowserToServerEvent.UnshareReport.route}`, async (req, reply) => {
    const user = req.user;

    if (!user || user.isExternal) {
      return reply.status(401).send({ message: "Unauthorized" });
    }

    const { userId, reportId } = req.params;

    if (!userId) {
      return reply.status(400).send({ message: "User ID is required" });
    }

    if (!reportId) {
      return reply.status(400).send({ message: "Report ID is required" });
    }

    const dbUser = await db.user.selectById(server.pg, user.id);

    if (!dbUser) {
      return reply.status(400).send({ message: "User not found" });
    }

    if (
      !u.permission.isAllowed(
        u.permission.FEATURE.UNSHARE_REPORT_WITH_USER,
        dbUser.permission
      )
    ) {
      return reply.status(403).send({ message: "Forbidden" });
    }

    const dbUserToShareWith = await db.user.selectById(server.pg, userId);

    if (!dbUserToShareWith) {
      return reply
        .status(400)
        .send({ message: "User to share with not found" });
    }

    if (dbUserToShareWith.companyId !== dbUser.companyId) {
      return reply.status(400).send({
        message: "User to unshare report with is not in the same company",
      });
    }

    if (dbUserToShareWith.id === dbUser.id) {
      return reply
        .status(400)
        .send({ message: "Cannot unshare report from yourself" });
    }

    const report = await db.report.selectById(
      server.pg,
      reportId,
      dbUser.companyId
    );

    if (!report) {
      return reply.status(404).send({ message: "Report not found" });
    }

    const reportUser = await db.reportUser.selectByUserIdAndReportId(
      server.pg,
      dbUserToShareWith.id,
      reportId,
      dbUser.companyId
    );

    if (!reportUser) {
      return reply
        .status(400)
        .send({ message: "Nothing to delete. Report not shared with user" });
    }

    await db.reportUser.deleteById(
      server.pg,
      reportId,
      dbUser.companyId,
      dbUserToShareWith.id
    );

    d.report.captureReportShareEventInAnalytics(
      server,
      dbUser,
      dbUserToShareWith,
      server.analytics.event.REPORT_UNSHARED,
      report
    );

    return reply.status(200).send({ success: true });
  });

  server.get<{
    Params: BrowserToServerEvent.GetReportSharedWith.RequestParams;
    Reply: {
      200: BrowserToServerEvent.GetReportSharedWith.SuccessResponseBody;
      "4xx": BrowserToServerEvent.GetReportSharedWith.ErrorResponseBody;
    };
  }>(
    `/${BrowserToServerEvent.GetReportSharedWith.route}`,
    async (req, reply) => {
      const user = req.user;

      if (!user || user.isExternal) {
        return reply.status(401).send({ message: "Unauthorized" });
      }

      const { reportId } = req.params;

      if (!reportId) {
        return reply.status(400).send({ message: "Report ID is required" });
      }

      const dbUser = await db.user.selectById(server.pg, user.id);

      if (!dbUser) {
        return reply.status(400).send({ message: "User not found" });
      }

      if (
        !u.permission.isAllowed(
          u.permission.FEATURE.VIEW_REPORT_SHARED_WITH,
          dbUser.permission
        )
      ) {
        return reply.status(403).send({ message: "Forbidden" });
      }

      const reportUsers = await db.reportUser.selectByReportId(
        server.pg,
        reportId,
        dbUser.companyId
      );

      return reply.status(200).send({ reportUsers });
    }
  );
}

export { reportRoutes };
