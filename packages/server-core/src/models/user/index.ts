import { m } from "@compose/ts";

import { Postgres } from "../../services/postgres";

async function selectByEmail(pg: Postgres, email: string) {
  const result = await pg.query<m.User.DB>(
    `SELECT *
     FROM "user"
     WHERE "email" = $1`,
    [email]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function selectById(pg: Postgres, id: string) {
  const result = await pg.query<m.User.DB>(
    `SELECT * FROM "user" WHERE "id" = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function selectByCompanyId(pg: Postgres, companyId: string) {
  const result = await pg.query<m.User.DB>(
    `SELECT * FROM "user" WHERE "companyId" = $1`,
    [companyId]
  );

  return result.rows;
}

async function insert(
  pg: Postgres,
  companyId: string,
  firstName: string,
  lastName: string,
  email: string,
  developmentEnvironmentId: string | null,
  permission: m.User.DB["permission"]
) {
  const result = await pg.query<m.User.DB>(
    `INSERT INTO "user" ("companyId", "firstName", "lastName", "email", "developmentEnvironmentId", "permission")
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      companyId,
      firstName,
      lastName,
      email,
      developmentEnvironmentId,
      permission,
    ]
  );

  if (result.rowCount === 0) {
    throw new Error("Failed to insert user into database");
  }

  return result.rows[0];
}

async function selectAllWithCompany(pg: Postgres) {
  const result = await pg.query<m.User.DB & { company: m.Company.DB }>(
    `
    SELECT 
      "user".*, 
      (
        SELECT to_json("company".*)
        FROM "company" 
        WHERE "company"."id" = "user"."companyId"
      ) AS "company"
    FROM "user"
    `
  );

  return result.rows;
}

async function selectAll(pg: Postgres) {
  const result = await pg.query<m.User.DB>(`SELECT * FROM "user"`);

  return result.rows;
}

async function deleteById(pg: Postgres, id: string, companyId: string) {
  await pg.query(`DELETE FROM "user" WHERE "id" = $1 AND "companyId" = $2`, [
    id,
    companyId,
  ]);
}

async function selectCountAllByCompanyId(pg: Postgres, companyId: string) {
  const result = await pg.query<{ count: number }>(
    `SELECT COUNT(*) FROM "user" WHERE "companyId" = $1`,
    [companyId]
  );

  if (result.rowCount === 0) {
    return 0;
  }

  return parseInt(result.rows[0].count as unknown as string);
}

async function selectAllByCompanyIdAndPermission(
  pg: Postgres,
  companyId: string,
  permission: m.User.DB["permission"]
) {
  const result = await pg.query<m.User.DB>(
    `SELECT * FROM "user" WHERE "companyId" = $1 AND "permission" = $2`,
    [companyId, permission]
  );

  return result.rows;
}

async function updatePermission(
  pg: Postgres,
  id: string,
  permission: m.User.DB["permission"]
) {
  const result = await pg.query<m.User.DB>(
    `UPDATE "user" SET "permission" = $1 WHERE "id" = $2 RETURNING *`,
    [permission, id]
  );

  if (result.rowCount === 0) {
    throw new Error("Failed to update user permission");
  }

  return result.rows[0];
}

export {
  selectByEmail,
  selectById,
  selectByCompanyId,
  insert,
  selectAllWithCompany,
  selectAll,
  deleteById,
  selectCountAllByCompanyId,
  updatePermission,
  selectAllByCompanyIdAndPermission,
};
