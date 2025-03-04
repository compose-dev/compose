import { m } from "@compose/ts";

import { Postgres } from "../../services/postgres";

async function insert(
  pg: Postgres,
  companyId: string,
  email: string,
  environmentId: string,
  createdByUserId: string,
  appRoute: string
) {
  const result = await pg.query<m.ExternalAppUser.DB>(
    `
        INSERT INTO "externalAppUser" ("companyId", "email", "environmentId", "createdByUserId", "appRoute")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
    [companyId, email, environmentId, createdByUserId, appRoute]
  );

  return result.rows[0];
}

async function insertFromSdk(
  pg: Postgres,
  companyId: string,
  email: string,
  environmentId: string,
  appRoute: string
) {
  const result = await pg.query<m.ExternalAppUser.DB>(
    `
        INSERT INTO "externalAppUser" ("companyId", "email", "environmentId", "appRoute", "createdBySdk")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
    [companyId, email, environmentId, appRoute, true]
  );

  return result.rows[0];
}

async function selectByEmail(pg: Postgres, email: string) {
  const result = await pg.query<m.ExternalAppUser.DB>(
    `
        SELECT * FROM "externalAppUser" WHERE "email" = $1
      `,
    [email]
  );

  return result.rows;
}

async function selectWithDetailsByEmail(pg: Postgres, email: string) {
  const result = await pg.query<m.ExternalAppUser.WithDetails>(
    `
        SELECT 
          "externalAppUser".*,
          (to_jsonb("environment") - 'apiKey' - 'decryptableKey') AS "environment",
          "company"."name" AS "companyName"
        FROM "externalAppUser"
        JOIN "environment" ON "externalAppUser"."environmentId" = "environment"."id"
        JOIN "company" ON "environment"."companyId" = "company"."id"
        WHERE "externalAppUser"."email" = $1
      `,
    [email]
  );

  return result.rows;
}

async function selectByAppRouteAndEnvironmentId(
  pg: Postgres,
  appRoute: string,
  environmentId: string
) {
  const result = await pg.query<m.ExternalAppUser.DB>(
    `
        SELECT * FROM "externalAppUser" WHERE "appRoute" = $1 AND "environmentId" = $2
      `,
    [appRoute, environmentId]
  );

  return result.rows;
}

async function selectById(pg: Postgres, id: string) {
  const result = await pg.query<m.ExternalAppUser.DB>(
    `
        SELECT * FROM "externalAppUser" WHERE "id" = $1
      `,
    [id]
  );
  return result.rows[0];
}

async function deleteById(pg: Postgres, id: string) {
  await pg.query(
    `
        DELETE FROM "externalAppUser" WHERE "id" = $1
      `,
    [id]
  );
}

async function selectByCompanyId(pg: Postgres, companyId: string) {
  const result = await pg.query<m.ExternalAppUser.DB>(
    `SELECT * FROM "externalAppUser" WHERE "companyId" = $1`,
    [companyId]
  );

  return result.rows;
}

export {
  insert,
  insertFromSdk,
  selectByEmail,
  selectWithDetailsByEmail,
  selectByAppRouteAndEnvironmentId,
  selectById,
  deleteById,
  selectByCompanyId,
};
