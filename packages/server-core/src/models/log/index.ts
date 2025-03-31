import { m } from "@compose/ts";
import { u as uPublic } from "@composehq/ts-public";

import { Postgres } from "../../services/postgres";

const ALL_FIELDS_EXCEPT_COMPANY_ID_AND_ID = [
  '"log"."createdAt"',
  '"log"."environmentId"',
  '"log"."userId"',
  '"log"."userEmail"',
  '"log"."appRoute"',
  '"log"."message"',
  '"log"."data"',
  '"log"."severity"',
  '"log"."type"',
] as const;

const ALL_FIELDS_EXCEPT_COMPANY_ID_AND_ID_STRING =
  ALL_FIELDS_EXCEPT_COMPANY_ID_AND_ID.join(", ");

async function insert(
  pg: Postgres,
  companyId: string,
  environmentId: string,
  userId: string | null,
  userEmail: string | null,
  appRoute: string,
  message: string,
  data: Record<string, any> | null,
  severity: uPublic.log.Severity,
  type: uPublic.log.Type
) {
  const result = await pg.query<m.Log.DB>(
    `
        INSERT INTO "log" (
          "companyId", 
          "environmentId", 
          "userId", 
          "userEmail", 
          "appRoute", 
          "message", 
          "data", 
          "severity",
          "type"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `,
    [
      companyId,
      environmentId,
      userId,
      userEmail,
      appRoute,
      message,
      data,
      severity,
      type,
    ]
  );

  if (result.rows.length === 0) {
    throw new Error("Failed to insert log");
  }

  return result.rows[0];
}

async function selectPage(
  pg: Postgres,
  companyId: string,
  limit: number,
  offset: number,
  appRoute: string | null,
  userEmail: string | null,
  severity: uPublic.log.Severity[],
  datetimeStart: Date | null,
  datetimeEnd: Date | null,
  message: string | null,
  type: uPublic.log.Type | null
) {
  const conditions = [`"companyId" = $3`];
  const params: any[] = [companyId];
  let paramIndex = 4;

  if (appRoute) {
    conditions.push(`"appRoute" = $${paramIndex}`);
    params.push(appRoute);
    paramIndex++;
  }

  if (userEmail) {
    conditions.push(`"userEmail" = $${paramIndex}`);
    params.push(userEmail);
    paramIndex++;
  }

  if (datetimeStart) {
    const dateString = new Date(datetimeStart).toISOString();
    conditions.push(`"createdAt" >= $${paramIndex}`);
    params.push(dateString);
    paramIndex++;
  }

  if (datetimeEnd) {
    const dateString = new Date(datetimeEnd).toISOString();
    conditions.push(`"createdAt" <= $${paramIndex}`);
    params.push(dateString);
    paramIndex++;
  }

  if (severity.length > 0) {
    conditions.push(`"severity" = ANY($${paramIndex})`);
    params.push(severity);
    paramIndex++;
  }

  if (message) {
    conditions.push(`"message" ILIKE $${paramIndex}`);
    params.push(`%${message}%`);
    paramIndex++;
  }

  if (type) {
    conditions.push(`"type" = $${paramIndex}`);
    params.push(type);
    paramIndex++;
  }

  const result = await pg.query<Omit<m.Log.DB, "companyId" | "id">>(
    `
        SELECT ${ALL_FIELDS_EXCEPT_COMPANY_ID_AND_ID_STRING} FROM "log"
        WHERE ${conditions.join(" AND ")}
        ORDER BY "createdAt" DESC
        LIMIT $1 OFFSET $2
      `,
    [limit, offset, ...params]
  );

  return result.rows;
}

export { insert, selectPage };
