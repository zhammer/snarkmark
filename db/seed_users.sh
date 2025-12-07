#!/bin/bash

# Seeds the users table with initial users.

set -e

DB_CONNECTION_STRING="${1:-postgres://postgres:pass@localhost:5432/snarkmark?sslmode=disable}"

echo "Seeding users..."

psql "$DB_CONNECTION_STRING" <<EOF
INSERT INTO users (email, username) VALUES
  ('zach@snarkmark.com', 'whatthezach'),
  ('caroline@snarkmark.com', 'carolinear'),
  ('lee@snarkmark.com', 'budlee')
ON CONFLICT (email) DO NOTHING;
EOF

echo "Done! Seeded users table."
