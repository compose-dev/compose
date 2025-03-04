BEGIN;

    CREATE TABLE IF NOT EXISTS "deploy" (
        "id" SERIAL PRIMARY KEY,
        "deployId" TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS "deploy_createdAt_idx" ON "deploy" ("createdAt" DESC);

COMMIT;