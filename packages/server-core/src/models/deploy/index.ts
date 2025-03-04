import { m } from "@compose/ts";

import { Postgres } from "../../services/postgres";

async function insert(pg: Postgres, deployId: m.Deploy.DB["deployId"]) {
  const result = await pg.query<m.Deploy.DB>(
    `
      INSERT INTO "deploy" ("deployId")
      VALUES ($1)
      RETURNING *
    `,
    [deployId]
  );

  return result.rows[0];
}

async function selectMostRecent(pg: Postgres) {
  const result = await pg.query<Pick<m.Deploy.DB, "deployId" | "createdAt">>(
    `
      SELECT "deployId", "createdAt" FROM "deploy"
      ORDER BY "createdAt" DESC
      LIMIT 1
    `
  );

  return result.rows[0];
}

export { insert, selectMostRecent };
