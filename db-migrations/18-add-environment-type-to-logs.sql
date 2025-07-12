BEGIN;

    ALTER TABLE "log" ADD COLUMN IF NOT EXISTS "environmentType" TEXT DEFAULT 'unspecified' NOT NULL;
    
    UPDATE "log"
        SET "environmentType" = "environment"."type"
        FROM "environment"
        WHERE "log"."environmentId" = "environment"."id"
        AND "log"."environmentType" = 'unspecified';

COMMIT;