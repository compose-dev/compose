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
  '"log"."environmentType"',
] as const;

const ALL_FIELDS_EXCEPT_COMPANY_ID_AND_ID_STRING =
  ALL_FIELDS_EXCEPT_COMPANY_ID_AND_ID.join(", ");

async function insert(
  pg: Postgres,
  companyId: string,
  environmentId: string,
  environmentType: m.Environment.Type,
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
          "environmentType",
          "userId", 
          "userEmail", 
          "appRoute", 
          "message", 
          "data", 
          "severity",
          "type"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `,
    [
      companyId,
      environmentId,
      environmentType,
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

async function selectGroupedLogCounts(
  pg: Postgres,
  companyId: string,
  datetimeStart: Date,
  datetimeEnd: Date,
  environmentTypes: m.Environment.Type[],
  apps: { route: string; environmentId: string }[],
  trackedEvents: m.Report.TrackedEventRule[],
  userEmails: string[],
  includeAnonymousUsers: boolean
) {
  const params: any[] = [
    companyId,
    datetimeStart,
    datetimeEnd,
    environmentTypes,
  ];

  let query = `
      SELECT
        "userEmail", "environmentId", "appRoute", "message", COUNT(*)::integer as count
      FROM "log"
      WHERE "companyId" = $1
        AND "createdAt" >= $2
        AND "createdAt" <= $3
        AND "environmentType" = ANY($4)
  `;

  if (apps && apps.length > 0) {
    const valuePlaceholders = apps
      .map(
        (_, i) =>
          `($${params.length + 1 + i * 2}, $${params.length + 2 + i * 2})`
      )
      .join(", ");

    for (const app of apps) {
      params.push(app.route, app.environmentId);
    }
    query += ` AND ("appRoute", "environmentId") IN (${valuePlaceholders})`;
  }

  if (trackedEvents && trackedEvents.length > 0) {
    const valuePlaceholders = trackedEvents
      .map(
        (_, i) =>
          `($${params.length + 1 + i * 2}, $${params.length + 2 + i * 2})`
      )
      .join(", ");

    for (const trackedEvent of trackedEvents) {
      params.push(trackedEvent.event, trackedEvent.type);
    }
    query += ` AND ("message", "type") IN (${valuePlaceholders})`;
  }

  if (userEmails && userEmails.length > 0) {
    const valuePlaceholders = userEmails
      .map((_, i) => `$${params.length + 1 + i}`)
      .join(", ");

    params.push(...userEmails);

    if (includeAnonymousUsers) {
      query += ` AND ("userEmail" IN (${valuePlaceholders}) OR "userEmail" IS NULL)`;
    } else {
      query += ` AND "userEmail" IN (${valuePlaceholders})`;
    }
  } else if (!includeAnonymousUsers) {
    // If no user emails are provided, we only need to account for the case where
    // we want to EXCLUDE anonymous users.
    query += ` AND "userEmail" IS NOT NULL`;
  }

  query += `
      GROUP BY "userEmail", "environmentId", "appRoute", "message"
    `;

  const result = await pg.query<{
    userEmail: m.Log.DB["userEmail"];
    environmentId: m.Log.DB["environmentId"];
    appRoute: m.Log.DB["appRoute"];
    message: m.Log.DB["message"];
    count: number;
  }>(query, params);

  return result.rows;
}

async function selectDistinctLogMessages(pg: Postgres, companyId: string) {
  const result = await pg.query<{
    message: m.Log.DB["message"];
    type: m.Log.DB["type"];
  }>(
    `
    SELECT DISTINCT "message", "type" FROM "log" WHERE "companyId" = $1
  `,
    [companyId]
  );

  return result.rows;
}

export {
  insert,
  selectPage,
  selectGroupedLogCounts,
  selectDistinctLogMessages,
};
