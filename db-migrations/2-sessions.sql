BEGIN;

    CREATE TABLE IF NOT EXISTS "session" (
        "id" TEXT PRIMARY KEY,
        "userId" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "companyId" UUID NOT NULL REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "expiresAt" TIMESTAMPTZ NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "session_id_idx" ON "session" ("id");
    CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" ("userId");

COMMIT;