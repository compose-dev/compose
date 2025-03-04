BEGIN;

    ALTER TABLE "environment" ADD COLUMN IF NOT EXISTS "decryptableKey" text DEFAULT NULL;

COMMIT;