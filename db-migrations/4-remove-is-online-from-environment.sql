BEGIN;

    ALTER TABLE "environment" DROP COLUMN IF EXISTS "isOnline";
    ALTER TABLE "environment" DROP COLUMN IF EXISTS "isOnlineUpdatedAt";

COMMIT;