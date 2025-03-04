BEGIN;

    CREATE TABLE IF NOT EXISTS "emailCode" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        -- If this email code is for a specific company, we'll put that here
        -- (e.g. a new user is invited to join a company)
        "companyId" UUID REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "email" TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "metadata" JSONB NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "emailCode_id_idx" ON "emailCode" ("id");

COMMIT;