#!/bin/sh

source .env

# Ensure all env variables are set.
if [ -z $POSTGRES_USER ]; then
    echo "Set POSTGRES_USER before continuing."
    exit 1
fi

if [ -z $POSTGRES_PASSWORD ]; then
    echo "Set POSTGRES_PASSWORD before continuing."
    exit 1
fi

if [ -z $POSTGRES_DB ]; then
    echo "Set POSTGRES_DB before continuing."
    exit 1
fi

if [ -z $POSTGRES_HOSTNAME ]; then
    echo "Set POSTGRES_HOSTNAME before continuing."
    exit 1
fi

if [ -z $POSTGRES_PORT ]; then
    echo "Set POSTGRES_PORT before continuing."
    exit 1
fi

POSTGRES_DB_VERSION=postgres:16.3

# Create DB in docker container
docker run --name $POSTGRES_CONTAINER_NAME -e POSTGRES_USER=$POSTGRES_USER -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -e POSTGRES_DB=$POSTGRES_DB -h $POSTGRES_HOSTNAME -d -p $POSTGRES_CONTAINER_PORT:$POSTGRES_PORT $POSTGRES_DB_VERSION && sleep 3
docker run --name $TEST_POSTGRES_CONTAINER_NAME -e POSTGRES_USER=$POSTGRES_USER -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -e POSTGRES_DB=$POSTGRES_DB -h $POSTGRES_HOSTNAME -d -p $TEST_POSTGRES_CONTAINER_PORT:$POSTGRES_PORT $POSTGRES_DB_VERSION && sleep 3

# Set default tz to UTC
docker exec $POSTGRES_CONTAINER_NAME psql "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOSTNAME:$POSTGRES_PORT/$POSTGRES_DB" -c "ALTER USER \"$POSTGRES_USER\" SET timezone='UTC';"
docker exec $TEST_POSTGRES_CONTAINER_NAME psql "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOSTNAME:$POSTGRES_PORT/$POSTGRES_DB" -c "ALTER USER \"$POSTGRES_USER\" SET timezone='UTC';"