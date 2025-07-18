import { m } from "@compose/ts";

import { d } from "../../domain";
import { Postgres } from "../../services/postgres";

async function insert(
  pg: Postgres,
  companyId: string,
  title: string,
  description: m.Report.DB["description"],
  data: m.Report.DB["data"],
  createdByUserId: string,
  updatedByUserId: string
) {
  if (!d.report.validateReportData(data)) {
    throw new Error("Invalid report data");
  }

  const result = await pg.query<m.Report.DB>(
    `
    INSERT INTO "report" ("companyId", "title", "description", "data", "createdByUserId", "updatedByUserId")
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [companyId, title, description, data, createdByUserId, updatedByUserId]
  );

  if (result.rows.length === 0) {
    throw new Error("Failed to insert report");
  }

  return result.rows[0];
}

async function update(
  pg: Postgres,
  reportId: m.Report.DB["id"],
  companyId: string,
  title: string,
  description: m.Report.DB["description"],
  data: m.Report.DB["data"],
  updatedByUserId: string
) {
  if (!d.report.validateReportData(data)) {
    throw new Error("Invalid report data");
  }

  const result = await pg.query<m.Report.DB>(
    `
    UPDATE "report" 
    SET "title" = $1, "description" = $2, "data" = $3, "updatedByUserId" = $4, "updatedAt" = CURRENT_TIMESTAMP 
    WHERE "id" = $5 AND "companyId" = $6 
    RETURNING *
    `,
    [title, description, data, updatedByUserId, reportId, companyId]
  );

  if (result.rowCount === 0) {
    throw new Error("Report not found");
  }

  return result.rows[0];
}

async function selectById(
  pg: Postgres,
  reportId: m.Report.DB["id"],
  companyId: string
) {
  const result = await pg.query<m.Report.DB>(
    `SELECT * FROM "report" WHERE "id" = $1 AND "companyId" = $2`,
    [reportId, companyId]
  );

  return result.rows[0];
}

async function selectByIdWithCompanyName(
  pg: Postgres,
  reportId: m.Report.DB["id"],
  companyId: string
) {
  const result = await pg.query<m.Report.DB & { companyName: string }>(
    `SELECT "report".*, "company"."name" AS "companyName" 
     FROM "report" 
     JOIN "company" ON "report"."companyId" = "company"."id" 
     WHERE "report"."id" = $1 AND "report"."companyId" = $2`,
    [reportId, companyId]
  );

  return result.rows[0];
}

async function selectByCompanyId(pg: Postgres, companyId: string) {
  const result = await pg.query<m.Report.DB>(
    `SELECT * FROM "report" WHERE "companyId" = $1`,
    [companyId]
  );

  return result.rows;
}

async function selectFilteredByReportUser(
  pg: Postgres,
  companyId: string,
  userId: string
) {
  const result = await pg.query<m.Report.DB>(
    `SELECT * FROM "report" 
     WHERE "companyId" = $1 
     AND "id" IN (
       SELECT "reportId" 
       FROM "reportUser" 
       WHERE "userId" = $2
       AND "permission"->>'canView' = 'true'
     )`,
    [companyId, userId]
  );

  return result.rows;
}

async function deleteById(
  pg: Postgres,
  reportId: m.Report.DB["id"],
  companyId: string
) {
  const result = await pg.query(
    `DELETE FROM "report" WHERE "id" = $1 AND "companyId" = $2`,
    [reportId, companyId]
  );

  return result.rows;
}

async function selectAllWithCompanyNameAndReportUsers(pg: Postgres) {
  const result = await pg.query<
    m.Report.DB & { companyName: string; reportUsers: m.ReportUser.DB[] }
  >(
    `SELECT "report".*, 
            "company"."name" AS "companyName",
            COALESCE(
              json_agg("reportUser") FILTER (WHERE "reportUser"."id" IS NOT NULL),
              '[]'::json
            ) AS "reportUsers"
     FROM "report" 
     JOIN "company" ON "report"."companyId" = "company"."id"
     LEFT JOIN "reportUser" ON "report"."id" = "reportUser"."reportId"
     GROUP BY "report"."id", "company"."name"`
  );

  return result.rows;
}

export {
  insert,
  selectById,
  selectByCompanyId,
  deleteById,
  update,
  selectFilteredByReportUser,
  selectAllWithCompanyNameAndReportUsers,
  selectByIdWithCompanyName,
};
