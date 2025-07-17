import { m } from "@compose/ts";

import { Postgres } from "../../services/postgres";

async function insert(
  pg: Postgres,
  reportId: m.ReportUser.DB["id"],
  companyId: m.ReportUser.DB["companyId"],
  createdByUserId: m.ReportUser.DB["createdByUserId"],
  sharedWithUserId: m.ReportUser.DB["userId"],
  permission: m.ReportUser.DB["permission"]
) {
  const result = await pg.query(
    `INSERT INTO "reportUser" ("reportId", "userId", "companyId", "permission", "createdByUserId") VALUES ($1, $2, $3, $4, $5)`,
    [reportId, sharedWithUserId, companyId, permission, createdByUserId]
  );

  return result.rows;
}

async function deleteById(
  pg: Postgres,
  reportId: m.ReportUser.DB["id"],
  companyId: m.ReportUser.DB["companyId"],
  userId: m.ReportUser.DB["userId"]
) {
  const result = await pg.query(
    `DELETE FROM "reportUser" WHERE "reportId" = $1 AND "userId" = $2 AND "companyId" = $3`,
    [reportId, userId, companyId]
  );

  return result.rows;
}

async function selectByReportId(
  pg: Postgres,
  reportId: m.Report.DB["id"],
  companyId: m.Report.DB["companyId"]
) {
  const result = await pg.query<m.ReportUser.DB>(
    `SELECT * FROM "reportUser" WHERE "reportId" = $1 AND "companyId" = $2`,
    [reportId, companyId]
  );

  return result.rows;
}

async function selectByCompanyId(
  pg: Postgres,
  companyId: m.Report.DB["companyId"]
) {
  const result = await pg.query<m.ReportUser.DB>(
    `SELECT * FROM "reportUser" WHERE "companyId" = $1`,
    [companyId]
  );

  return result.rows;
}

async function selectByUserIdAndReportId(
  pg: Postgres,
  userId: m.ReportUser.DB["userId"],
  reportId: m.ReportUser.DB["reportId"],
  companyId: m.ReportUser.DB["companyId"]
) {
  const result = await pg.query<m.ReportUser.DB>(
    `SELECT * FROM "reportUser" WHERE "userId" = $1 AND "reportId" = $2 AND "companyId" = $3`,
    [userId, reportId, companyId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

async function selectByUserId(
  pg: Postgres,
  userId: m.ReportUser.DB["userId"],
  companyId: m.ReportUser.DB["companyId"]
) {
  const result = await pg.query<m.ReportUser.DB>(
    `SELECT * FROM "reportUser" WHERE "userId" = $1 AND "companyId" = $2`,
    [userId, companyId]
  );

  return result.rows;
}

export {
  insert,
  deleteById,
  selectByReportId,
  selectByCompanyId,
  selectByUserIdAndReportId,
  selectByUserId,
};
