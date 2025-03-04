import { m } from "@compose/ts";

import { Postgres } from "../../services/postgres";

async function insert(
  pg: Postgres,
  deploymentId: m.Deployment.DB["deploymentId"]
) {
  const result = await pg.query<m.Deployment.DB>(
    `
      INSERT INTO "deployment" ("deploymentId")
      VALUES ($1)
      RETURNING *
    `,
    [deploymentId]
  );

  return result.rows[0];
}

async function selectMostRecent(pg: Postgres) {
  const result = await pg.query<
    Pick<m.Deployment.DB, "deploymentId" | "createdAt">
  >(
    `
      SELECT "deploymentId", "createdAt" FROM "deployment"
      ORDER BY "createdAt" DESC
      LIMIT 1
    `
  );

  return result.rows[0];
}

export { insert, selectMostRecent };
