import { m } from "@compose/ts";

import { Postgres } from "../../services/postgres";

async function selectAll(pg: Postgres) {
  const result = await pg.query<m.ErrorLog.DB>(`SELECT * FROM "errorLog"`);

  return result.rows;
}

async function selectAllByStatus(
  pg: Postgres,
  status: m.ErrorLog.DB["status"]
) {
  const result = await pg.query<m.ErrorLog.DB>(
    `SELECT * FROM "errorLog" WHERE "status" = $1`,
    [status]
  );

  return result.rows;
}

async function insert(
  pg: Postgres,
  data: m.ErrorLog.DB["data"],
  status: m.ErrorLog.DB["status"] = m.ErrorLog.STATUS.PENDING
) {
  const result = await pg.query<m.ErrorLog.DB>(
    `
    INSERT INTO "errorLog" ("data", "status")
    VALUES ($1, $2)
    RETURNING *
  `,
    [data, status]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

async function deleteById(pg: Postgres, id: m.ErrorLog.DB["id"]) {
  await pg.query(`DELETE FROM "errorLog" WHERE "id" = $1`, [id]);
}

async function updateStatus(
  pg: Postgres,
  id: m.ErrorLog.DB["id"],
  status: m.ErrorLog.DB["status"]
) {
  const result = await pg.query<m.ErrorLog.DB>(
    `UPDATE "errorLog" SET "status" = $2 WHERE "id" = $1 RETURNING *`,
    [id, status]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
}

async function selectById(pg: Postgres, id: m.ErrorLog.DB["id"]) {
  const result = await pg.query<m.ErrorLog.DB>(
    `SELECT * FROM "errorLog" WHERE "id" = $1`,
    [id]
  );

  return result.rows[0];
}

export {
  selectAll,
  selectAllByStatus,
  insert,
  deleteById,
  updateStatus,
  selectById,
};
