import { m } from "@compose/ts";

import { Postgres } from "../../services/postgres";

const API_AND_DECRYPTABLE_KEY_OMITTED_SELECT_FIELDS = `"environment"."id", "environment"."companyId", "environment"."name", "environment"."type", "environment"."apps", "environment"."theme", "environment"."createdAt", "environment"."updatedAt", "environment"."data"`;
const API_KEY_OMITTED_SELECT_FIELDS = `${API_AND_DECRYPTABLE_KEY_OMITTED_SELECT_FIELDS}, "environment"."decryptableKey"`;

async function selectByApiKey(pg: Postgres, apiKey: string) {
  const result = await pg.query<m.Environment.ApiAndDecryptableKeyOmittedDB>(
    `SELECT ${API_AND_DECRYPTABLE_KEY_OMITTED_SELECT_FIELDS}
     FROM "environment"
     WHERE "apiKey" = $1`,
    [apiKey]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function selectByCompanyId(pg: Postgres, companyId: string) {
  const result = await pg.query<m.Environment.ApiAndDecryptableKeyOmittedDB>(
    `SELECT ${API_AND_DECRYPTABLE_KEY_OMITTED_SELECT_FIELDS}
     FROM "environment" WHERE "companyId" = $1`,
    [companyId]
  );

  return result.rows;
}

async function selectByCompanyIdWithDecryptableKey(
  pg: Postgres,
  companyId: string
) {
  const result = await pg.query<m.Environment.ApiKeyOmittedDB>(
    `SELECT ${API_KEY_OMITTED_SELECT_FIELDS},
     FROM "environment" WHERE "companyId" = $1`,
    [companyId]
  );

  return result.rows;
}

async function selectByCompanyIdWithDecryptableKeyAndExternalUsers(
  pg: Postgres,
  companyId: string
) {
  const result = await pg.query<
    m.Environment.ApiKeyOmittedDB & { externalAppUsers: m.ExternalAppUser.DB[] }
  >(
    `SELECT ${API_KEY_OMITTED_SELECT_FIELDS},
     COALESCE(json_agg("externalAppUser".*) FILTER (WHERE "externalAppUser"."id" IS NOT NULL), '[]') AS "externalAppUsers"
     FROM "environment"
     LEFT JOIN "externalAppUser" ON "environment"."id" = "externalAppUser"."environmentId"
     WHERE "environment"."companyId" = $1
     GROUP BY "environment"."id"`,
    [companyId]
  );

  return result.rows;
}

async function selectByIdWithExternalUsers(pg: Postgres, id: string) {
  const result = await pg.query<
    m.Environment.ApiAndDecryptableKeyOmittedDB & {
      externalAppUsers: m.ExternalAppUser.DB[];
    }
  >(
    `SELECT ${API_AND_DECRYPTABLE_KEY_OMITTED_SELECT_FIELDS},
     COALESCE(json_agg("externalAppUser".*) FILTER (WHERE "externalAppUser"."id" IS NOT NULL), '[]') AS "externalAppUsers"
     FROM "environment"
     LEFT JOIN "externalAppUser" ON "environment"."id" = "externalAppUser"."environmentId"
      WHERE "environment"."id" = $1
    GROUP BY ${API_AND_DECRYPTABLE_KEY_OMITTED_SELECT_FIELDS}
    `,
    [id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function selectById(pg: Postgres, id: string) {
  const result = await pg.query<m.Environment.ApiAndDecryptableKeyOmittedDB>(
    `SELECT ${API_AND_DECRYPTABLE_KEY_OMITTED_SELECT_FIELDS}
     FROM "environment" WHERE "id" = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function selectByIdWithDecryptableKey(pg: Postgres, id: string) {
  const result = await pg.query<m.Environment.ApiKeyOmittedDB>(
    `SELECT ${API_KEY_OMITTED_SELECT_FIELDS}
     FROM "environment" WHERE "id" = $1`,
    [id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function updateConfiguration(
  pg: Postgres,
  id: string,
  apps: m.Environment.DB["apps"],
  theme: m.Environment.DB["theme"],
  data: m.Environment.DB["data"]
) {
  const result = await pg.query<m.Environment.ApiAndDecryptableKeyOmittedDB>(
    `UPDATE "environment"
     SET
        "apps" = $2,
        "theme" = $3,
        "data" = $4,
        "updatedAt" = CURRENT_TIMESTAMP
     WHERE
        "id" = $1
     RETURNING ${API_AND_DECRYPTABLE_KEY_OMITTED_SELECT_FIELDS}
    `,
    [id, JSON.stringify(apps), JSON.stringify(theme), JSON.stringify(data)]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function insert(
  pg: Postgres,
  companyId: m.Environment.DB["companyId"],
  name: m.Environment.DB["name"],
  type: m.Environment.DB["type"],
  apiKey: m.Environment.DB["apiKey"],
  decryptableKey: m.Environment.DB["decryptableKey"]
) {
  const result = await pg.query<m.Environment.ApiAndDecryptableKeyOmittedDB>(
    `
    INSERT INTO "environment" ("companyId", "name", "type", "apiKey", "decryptableKey")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING ${API_AND_DECRYPTABLE_KEY_OMITTED_SELECT_FIELDS}
  `,
    [companyId, name, type, apiKey, decryptableKey]
  );

  return result.rows[0];
}

async function selectAll(pg: Postgres) {
  const result = await pg.query<m.Environment.ApiAndDecryptableKeyOmittedDB>(
    `SELECT ${API_AND_DECRYPTABLE_KEY_OMITTED_SELECT_FIELDS} FROM "environment"`
  );

  return result.rows;
}

async function selectAllWithCompanyName(pg: Postgres) {
  const result = await pg.query<
    m.Environment.ApiAndDecryptableKeyOmittedDB & { companyName: string }
  >(
    `SELECT ${API_AND_DECRYPTABLE_KEY_OMITTED_SELECT_FIELDS}, "company"."name" AS "companyName" FROM "environment" LEFT JOIN "company" ON "environment"."companyId" = "company"."id"`
  );

  return result.rows;
}

async function deleteById(pg: Postgres, id: string, companyId: string) {
  await pg.query(
    `DELETE FROM "environment" WHERE "id" = $1 AND "companyId" = $2`,
    [id, companyId]
  );
}

async function updateApiKey(
  pg: Postgres,
  id: string,
  companyId: string,
  apiKey: m.Environment.DB["apiKey"],
  decryptableKey: m.Environment.DB["decryptableKey"]
) {
  const result = await pg.query<m.Environment.ApiAndDecryptableKeyOmittedDB>(
    `
    UPDATE "environment" 
    SET "apiKey" = $1, "decryptableKey" = $2 
    WHERE "id" = $3 AND "companyId" = $4 
    RETURNING ${API_AND_DECRYPTABLE_KEY_OMITTED_SELECT_FIELDS}
  `,
    [apiKey, decryptableKey, id, companyId]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

export {
  selectByApiKey,
  selectById,
  selectByIdWithDecryptableKey,
  updateConfiguration,
  insert,
  selectByCompanyId,
  selectByCompanyIdWithDecryptableKey,
  selectByCompanyIdWithDecryptableKeyAndExternalUsers,
  selectByIdWithExternalUsers,
  selectAll,
  deleteById,
  selectAllWithCompanyName,
  updateApiKey,
};
