#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
POSTGRES_BIN="${POSTGRES_BIN:-}"

if [[ -z "$POSTGRES_BIN" ]] && command -v postgres >/dev/null 2>&1; then
  POSTGRES_BIN="$(dirname "$(command -v postgres)")"
fi

if [[ -z "$POSTGRES_BIN" ]] && command -v brew >/dev/null 2>&1; then
  POSTGRES_PREFIX="$(brew --prefix postgresql@17 2>/dev/null || true)"
  if [[ -x "$POSTGRES_PREFIX/bin/postgres" ]]; then
    POSTGRES_BIN="$POSTGRES_PREFIX/bin"
  fi
fi

if [[ -z "$POSTGRES_BIN" || ! -x "$POSTGRES_BIN/postgres" ]]; then
  echo "PostgreSQL 17 binaries are required. Set POSTGRES_BIN to their bin directory." >&2
  exit 1
fi

TMP_DB="$(mktemp -d "${TMPDIR:-/tmp}/elan-types.XXXXXX")"
PORT="${ELAN_TYPES_DB_PORT:-55433}"

cleanup() {
  "$POSTGRES_BIN/pg_ctl" -D "$TMP_DB/data" -m fast -w stop >/dev/null 2>&1 || true
  rm -rf "$TMP_DB"
}

trap cleanup EXIT

"$POSTGRES_BIN/initdb" -D "$TMP_DB/data" -A trust -U postgres >/dev/null
"$POSTGRES_BIN/pg_ctl" \
  -D "$TMP_DB/data" \
  -o "-p $PORT -k $TMP_DB" \
  -w start >/dev/null

DATABASE_URL="postgresql://postgres@127.0.0.1:$PORT/postgres"
PSQL=(
  "$POSTGRES_BIN/psql"
  "$DATABASE_URL"
  -v ON_ERROR_STOP=1
  -q
)

"${PSQL[@]}" <<'SQL'
create role anon nologin;
create role authenticated nologin;

create schema auth;
create schema storage;

create table auth.users (
  id uuid primary key,
  raw_user_meta_data jsonb not null default '{}'::jsonb
);

create function auth.uid()
returns uuid
language sql
stable
as $$
  select null::uuid;
$$;

create table storage.buckets (
  id text primary key,
  name text not null,
  public boolean not null default false,
  file_size_limit bigint,
  allowed_mime_types text[]
);

create table storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets(id),
  name text not null
);

alter table storage.objects enable row level security;
SQL

for migration in "$ROOT_DIR"/supabase/migrations/*.sql; do
  "${PSQL[@]}" -f "$migration"
done

DATABASE_URL="$DATABASE_URL" \
  PSQL_BIN="$POSTGRES_BIN/psql" \
  node "$ROOT_DIR/scripts/generate-database-types.mjs"
