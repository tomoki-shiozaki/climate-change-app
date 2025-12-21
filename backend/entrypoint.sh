#!/bin/sh
set -e # エラーがあったらスクリプトを即終了

echo "Waiting for PostgreSQL to be ready..."

# DBが起動するまでループ
MAX_RETRIES=30
COUNT=0

# DATABASE_URL から接続情報を使う
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DATABASE_NAME:-postgres}
DB_USER=${DATABASE_USER:-postgres}

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"; do
  COUNT=$((COUNT+1))
  if [ $COUNT -ge $MAX_RETRIES ]; then
    echo "Postgres did not become ready in time"
    exit 1
  fi
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up"

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Running migrations..."
  python manage.py migrate
else
  echo "Skipping migrations"
fi

exec "$@"
