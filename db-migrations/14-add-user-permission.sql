BEGIN;

    ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "permission" TEXT NOT NULL DEFAULT 'owner';

    -- Drop the default immediately after the migration.
    ALTER TABLE "user" ALTER COLUMN "permission" DROP DEFAULT;

COMMIT;