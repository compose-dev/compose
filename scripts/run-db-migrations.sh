#!/bin/sh

source .env

cd db-migrations

psql -h $POSTGRES_HOSTNAME -p $POSTGRES_CONTAINER_PORT -U $POSTGRES_USER -d $POSTGRES_DB -f all.sql

cd ..