BEGIN;

    ALTER TABLE "environment" ADD COLUMN "data" JSONB NOT NULL DEFAULT '{}';

COMMIT;
