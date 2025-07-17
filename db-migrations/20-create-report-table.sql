BEGIN;

    CREATE TABLE IF NOT EXISTS "report" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdByUserId" UUID NOT NULL REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        "updatedByUserId" UUID NOT NULL REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        "companyId" UUID NOT NULL REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "data" JSONB NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "report_companyId_idx" ON "report" ("companyId");

    CREATE TABLE IF NOT EXISTS "reportUser" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdByUserId" UUID NOT NULL REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        "userId" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "reportId" UUID NOT NULL REFERENCES "report"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "companyId" UUID NOT NULL REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "permission" JSONB NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "reportUser_companyId_userId_idx" ON "reportUser" ("companyId", "userId");

COMMIT;