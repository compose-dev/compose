BEGIN;

    -- Add companyId column if it doesn't exist
    ALTER TABLE "externalAppUser" ADD COLUMN IF NOT EXISTS "companyId" uuid REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    -- Backfill companyId using environmentId
    UPDATE "externalAppUser"
    SET "companyId" = "environment"."companyId"
    FROM "environment"
    WHERE "externalAppUser"."environmentId" = "environment"."id"
    AND "externalAppUser"."companyId" IS NULL;

    -- Make companyId not nullable
    ALTER TABLE "externalAppUser" ALTER COLUMN "companyId" SET NOT NULL;

COMMIT;
