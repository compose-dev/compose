BEGIN;

    CREATE TABLE IF NOT EXISTS "log" (
        "id" bigserial PRIMARY KEY,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "companyId" UUID NOT NULL REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "environmentId" UUID REFERENCES "environment"("id") ON DELETE SET NULL ON UPDATE SET NULL,
        "userId" UUID REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE SET NULL DEFAULT NULL,
        "userEmail" TEXT DEFAULT NULL,
        "appRoute" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "data" JSONB DEFAULT NULL,
        "severity" TEXT NOT NULL,
        -- specify whether the log is created by the user or the system.
        "type" TEXT NOT NULL
    );

    -- Create a compound index on companyId and createdAt in descending order
    -- This will improve query performance when filtering logs by company and sorting by creation date
    CREATE INDEX IF NOT EXISTS "log_companyId_createdAt_idx" ON "log" ("companyId", "createdAt" DESC);

    -- Drop the deprecated deployment table.
    DROP TABLE IF EXISTS "deployment";

    -- Update company flags to add AUDIT_LOG_RATE_LIMIT_PER_MINUTE if it doesn't exist
    -- Set a default of 200 logs per minute
    UPDATE "company"
    SET "flags" = "flags" || '{"AUDIT_LOG_RATE_LIMIT_PER_MINUTE": 200}'::jsonb
    WHERE NOT ("flags" ? 'AUDIT_LOG_RATE_LIMIT_PER_MINUTE');

COMMIT;