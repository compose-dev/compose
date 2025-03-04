BEGIN;

    CREATE TABLE IF NOT EXISTS "externalAppUser" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" TEXT NOT NULL,
        "environmentId" UUID NOT NULL REFERENCES "environment"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "appRoute" TEXT NOT NULL,
        "createdByUserId" UUID NOT NULL REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- Index the email since that's how we'll query this table most often.
    CREATE INDEX IF NOT EXISTS "externalAppUser_email_idx" ON "externalAppUser" ("email");

    -- Drop `NOT NULL` constraint from `session` to support the new `externalAppUser` table.
    ALTER TABLE "session" ALTER COLUMN "userId" DROP NOT NULL;
    ALTER TABLE "session" ALTER COLUMN "companyId" DROP NOT NULL;

    -- Next, add a new `isExternal` and `email` column to the `session` table.
    ALTER TABLE "session" ADD COLUMN "isExternal" BOOLEAN NOT NULL DEFAULT FALSE;
    ALTER TABLE "session" ADD COLUMN "email" TEXT NOT NULL;

COMMIT;