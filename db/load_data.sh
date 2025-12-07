#!/bin/bash

# Loads data from JSTOR jsonl file into the PostgreSQL database.

set -e

DB_CONNECTION_STRING="${1:-postgres://postgres:pass@localhost:5432/snarkmark?sslmode=disable}"
DATA_FILE="${2:-filtered_20s.jsonl}"

echo "Loading data from $DATA_FILE into database..."

jq -r '[.item_id, .title, .published_date, .creators_string, .url] | @tsv' "$DATA_FILE" | \
  psql "$DB_CONNECTION_STRING" -c "\copy jstor_articles(item_id, title, published_date, creators_string, url) FROM STDIN"

echo "Done! Loaded data into jstor_articles table."
