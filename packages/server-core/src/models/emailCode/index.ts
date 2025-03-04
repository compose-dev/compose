import { m } from "@compose/ts";

import { Postgres } from "../../services/postgres";

async function insert(
  pg: Postgres,
  companyId: string | null,
  email: string,
  expiresAt: Date,
  metadata: m.EmailCode.DB["metadata"]
) {
  const result = await pg.query<m.EmailCode.DB>(
    `
        INSERT INTO "emailCode" ("companyId", "email", "expiresAt", "metadata")
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
    [companyId, email, expiresAt, metadata]
  );

  return result.rows[0];
}

async function selectById(pg: Postgres, id: string) {
  const result = await pg.query<m.EmailCode.DB>(
    `SELECT * FROM "emailCode" WHERE "id" = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

async function selectByIdWithCompany(pg: Postgres, id: string) {
  const result = await pg.query<m.EmailCode.WithCompany>(
    `SELECT 
      "emailCode".*, 
      (
        SELECT to_json("company".*)
        FROM "company" 
        WHERE "company"."id" = "emailCode"."companyId"
      ) AS "company"
    FROM "emailCode"
    WHERE "emailCode"."id" = $1
    `,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

async function deleteById(pg: Postgres, id: string) {
  await pg.query(
    `
        DELETE FROM "emailCode" WHERE "id" = $1
      `,
    [id]
  );
}

async function selectByCompanyId(pg: Postgres, companyId: string) {
  const result = await pg.query<m.EmailCode.DB>(
    `SELECT * FROM "emailCode" WHERE "companyId" = $1`,
    [companyId]
  );

  return result.rows;
}

export {
  insert,
  selectById,
  selectByIdWithCompany,
  deleteById,
  selectByCompanyId,
};
