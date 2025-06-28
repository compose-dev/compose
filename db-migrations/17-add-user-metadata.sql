BEGIN;

    ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "metadata" JSONB NOT NULL DEFAULT '{}';

    -- Drop the default immediately after the migration.
    ALTER TABLE "user" ALTER COLUMN "metadata" DROP DEFAULT;

COMMIT;