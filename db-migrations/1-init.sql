BEGIN;

    CREATE TABLE IF NOT EXISTS "company" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" TEXT NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- Add index on company id
    CREATE INDEX IF NOT EXISTS "company_id_idx" ON "company" ("id");

    -- Create type for environment type
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_type WHERE typname = 'environmentType'
        ) THEN
            CREATE TYPE "environmentType" AS ENUM ('development', 'production');
        END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS "environment" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "companyId" UUID NOT NULL REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "name" TEXT NOT NULL,
        "apiKey" TEXT NOT NULL UNIQUE,
        "type" "environmentType" NOT NULL,
        "apps" JSONB NOT NULL DEFAULT '[]',
        "isOnline" BOOLEAN NOT NULL DEFAULT FALSE,
        "isOnlineUpdatedAt" TIMESTAMPTZ DEFAULT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- Add index on apiKey id and compound index on companyId and id
    CREATE INDEX IF NOT EXISTS "environment_id_idx" ON "environment" ("id");
    CREATE INDEX IF NOT EXISTS "environment_companyId_id_idx" ON "environment" ("companyId", "id");

    CREATE TABLE IF NOT EXISTS "user" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "companyId" UUID NOT NULL REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "developmentEnvironmentId" UUID DEFAULT NULL REFERENCES "environment"("id") ON DELETE SET NULL ON UPDATE CASCADE
    );

    -- Add index on user id and compound index on companyId and id
    CREATE INDEX IF NOT EXISTS "user_id_idx" ON "user" ("id");
    CREATE INDEX IF NOT EXISTS "user_companyId_id_idx" ON "user" ("companyId", "id");

COMMIT;