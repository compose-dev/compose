BEGIN;

    CREATE TABLE IF NOT EXISTS "deployment" (
        "id" SERIAL PRIMARY KEY,
        "deploymentId" TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS "deployment_createdAt_idx" ON "deployment" ("createdAt" DESC);

COMMIT;