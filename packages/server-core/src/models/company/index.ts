import { m } from "@compose/ts";

import { Postgres } from "../../services/postgres";

async function selectAll(pg: Postgres) {
  const result = await pg.query<m.Company.DB>(`SELECT * FROM "company"`);

  return result.rows;
}

async function selectById(pg: Postgres, id: m.Company.DB["id"]) {
  const result = await pg.query<m.Company.DB>(
    `SELECT * FROM "company" WHERE "id" = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

async function insert(
  pg: Postgres,
  companyName: m.Company.DB["name"],
  plan: m.Company.DB["plan"],
  billingId: m.Company.DB["billingId"],
  flags: m.Company.DB["flags"]
) {
  const result = await pg.query<m.Company.DB>(
    `
    INSERT INTO "company" ("name", "plan", "billingId", "flags")
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
    [companyName, plan, billingId, flags]
  );

  return result.rows[0];
}

async function deleteById(pg: Postgres, id: m.Company.DB["id"]) {
  await pg.query(`DELETE FROM "company" WHERE "id" = $1`, [id]);
}

async function addBillingId(
  pg: Postgres,
  id: m.Company.DB["id"],
  billingId: m.Company.DB["billingId"]
) {
  await pg.query(`UPDATE "company" SET "billingId" = $2 WHERE "id" = $1`, [
    id,
    billingId,
  ]);
}

async function updatePlan(
  pg: Postgres,
  id: m.Company.DB["id"],
  plan: m.Company.DB["plan"]
) {
  await pg.query(`UPDATE "company" SET "plan" = $2 WHERE "id" = $1`, [
    id,
    plan,
  ]);
}

async function updateFlags(
  pg: Postgres,
  id: m.Company.DB["id"],
  flags: m.Company.DB["flags"]
) {
  await pg.query(`UPDATE "company" SET "flags" = $2 WHERE "id" = $1`, [
    id,
    flags,
  ]);
}

export {
  selectAll,
  selectById,
  insert,
  deleteById,
  addBillingId,
  updatePlan,
  updateFlags,
};
