#!/bin/bash

# Restarts the local PostgreSQL database from scratch.
# Starts Docker container, drops/recreates database, applies schema, and loads data.

set -e

CONTAINER_NAME="snarkmark-postgres"
DB_NAME="snarkmark"
DB_USER="postgres"
DB_PASS="pass"
DB_PORT="5432"

DB_CONNECTION_STRING="postgres://$DB_USER:$DB_PASS@localhost:$DB_PORT/$DB_NAME?sslmode=disable"
BASE_CONNECTION="postgres://$DB_USER:$DB_PASS@localhost:$DB_PORT/postgres?sslmode=disable"
DATA_FILE="${1:-db/filtered.jsonl}"

echo "==> Stopping existing container if running..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Wait for container to be fully removed
sleep 1

echo "==> Starting PostgreSQL container..."
docker run -d \
  --name $CONTAINER_NAME \
  -e POSTGRES_USER=$DB_USER \
  -e POSTGRES_PASSWORD=$DB_PASS \
  -p $DB_PORT:5432 \
  postgres:16

echo "==> Waiting for PostgreSQL to be ready..."
until docker exec $CONTAINER_NAME pg_isready -U $DB_USER 2>/dev/null; do
  sleep 1
done

echo "==> Creating database $DB_NAME..."
psql "$BASE_CONNECTION" -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || true

echo "==> Applying schema with Atlas..."
atlas schema apply --url "$DB_CONNECTION_STRING" --to "file://db/schema.hcl" --auto-approve

echo "==> Loading article data from $DATA_FILE..."
./db/load_data.sh "$DB_CONNECTION_STRING" "$DATA_FILE"

echo "==> Seeding users..."
./db/seed_users.sh "$DB_CONNECTION_STRING"

echo "==> Done! Database restarted successfully."
