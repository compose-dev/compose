import { m } from "@compose/ts";

import { Postgres } from "../../services/postgres";

async function deleteExpired(pg: Postgres) {
  await pg.query(
    `DELETE FROM "session"
     WHERE "expiresAt" < now()`
  );
}

async function deleteById(pg: Postgres, id: string) {
  await pg.query(
    `DELETE FROM "session"
     WHERE "id" = $1`,
    [id]
  );
}

async function deleteByUserId(pg: Postgres, id: string) {
  await pg.query(
    `DELETE FROM "session"
     WHERE "userId" = $1`,
    [id]
  );
}

async function insert(
  pg: Postgres,
  id: string,
  userId: string | null,
  companyId: string | null,
  email: string,
  isExternal: boolean,
  expiresAt: Date
) {
  const result = await pg.query(
    `INSERT INTO "session" (
        "id",
        "userId",
        "companyId",
        "email",
        "isExternal",
        "expiresAt"
    ) VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT ("id") DO UPDATE SET "expiresAt" = EXCLUDED."expiresAt"`,
    [id, userId, companyId, email, isExternal, expiresAt]
  );

  return result.rowCount === 1;
}

async function updateExpiration(pg: Postgres, id: string, expiresAt: Date) {
  const result = await pg.query(
    `UPDATE "session"
     SET "expiresAt" = $2
     WHERE "id" = $1`,
    [id, expiresAt]
  );

  return result.rowCount === 1;
}

async function selectByUserId(pg: Postgres, userId: string) {
  const result = await pg.query<m.Session.DB>(
    `SELECT *
     FROM "session"
     WHERE "userId" = $1`,
    [userId]
  );

  return result.rows;
}

async function selectById(pg: Postgres, id: string) {
  const result = await pg.query<m.Session.DB>(
    `SELECT *
     FROM "session"
     WHERE "id" = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

export {
  deleteById,
  deleteByUserId,
  deleteExpired,
  insert,
  selectById,
  selectByUserId,
  updateExpiration,
};
