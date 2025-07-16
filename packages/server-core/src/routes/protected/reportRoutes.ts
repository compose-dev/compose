import { BrowserToServerEvent, u } from "@compose/ts";
import { FastifyInstance } from "fastify";

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
      req.body.data,
      user.id,
      user.id
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

    if (
      !u.permission.isAllowed(
        u.permission.FEATURE.VIEW_LIST_OF_REPORTS,
        dbUser.permission
      )
    ) {
      return reply.status(403).send({ message: "Forbidden" });
    }

    const reports = await db.report.selectByCompanyId(
      server.pg,
      dbUser.companyId
    );

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

    await db.report.deleteById(server.pg, reportId, dbUser.companyId);

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
      req.body.data,
      user.id
    );

    return reply.status(200).send({ report });
  });
}

export { reportRoutes };
