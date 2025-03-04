# Guidelines for writing migrations

This file contains guidelines to follow when writing database migrations.

## Naming

Following the existing naming scheme. We increment a number followed by a descriptive name of what the migration does.

## all.sql

After creating the migration, also add it to the `all.sql` file.

## Idempotency

All migrations should be idempotent. This means that they can be applied multiple times without causing issues.

## Atomicity

We make our migrations atomic by enclosing the migration in a transaction, e.g.

```
BEGIN;

-- migration code here

COMMIT;
```

## Alerting

Once deployed, it's best practice to alert the team of the migration so that other devs can apply the migration to their local database.
