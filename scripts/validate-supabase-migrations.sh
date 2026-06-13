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

TMP_DB="$(mktemp -d "${TMPDIR:-/tmp}/elan-pg.XXXXXX")"
PORT="${ELAN_TEST_DB_PORT:-55432}"

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

PSQL=(
  "$POSTGRES_BIN/psql"
  -h "$TMP_DB"
  -p "$PORT"
  -U postgres
  -v ON_ERROR_STOP=1
  -q
)

"${PSQL[@]}" postgres <<'SQL'
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
  echo "Applying $(basename "$migration")"
  "${PSQL[@]}" postgres -f "$migration"
done

echo "Reapplying storefront seed to verify idempotency"
"${PSQL[@]}" postgres \
  -f "$ROOT_DIR/supabase/migrations/20260613192000_seed_storefront.sql"

"${PSQL[@]}" postgres <<'SQL'
do $$
declare
  unprotected_tables integer;
begin
  if (select count(*) from public.categories) <> 6 then
    raise exception 'Expected 6 categories';
  end if;

  if (select count(*) from public.collections) <> 3 then
    raise exception 'Expected 3 collections';
  end if;

  if (select count(*) from public.products) <> 8 then
    raise exception 'Expected 8 products';
  end if;

  if (select count(*) from public.product_variants) <> 68 then
    raise exception 'Expected 68 variants';
  end if;

  if (select count(*) from public.inventory_levels) <> 68 then
    raise exception 'Expected 68 inventory levels';
  end if;

  if (select count(*) from public.boxes) <> 3 then
    raise exception 'Expected 3 boxes';
  end if;

  if (select count(*) from public.homepage_sections) <> 10 then
    raise exception 'Expected 10 homepage sections';
  end if;

  if (select count(*) from public.homepage_section_items) <> 28 then
    raise exception 'Expected 28 homepage items';
  end if;

  if (select count(*) from storage.buckets where id = 'catalog-media') <> 1 then
    raise exception 'Expected catalog-media bucket';
  end if;

  select count(*)
  into unprotected_tables
  from pg_class
  join pg_namespace on pg_namespace.oid = pg_class.relnamespace
  where pg_namespace.nspname = 'public'
    and pg_class.relkind = 'r'
    and not pg_class.relrowsecurity;

  if unprotected_tables <> 0 then
    raise exception '% public tables do not have RLS enabled', unprotected_tables;
  end if;
end
$$;
SQL

ANON_PRODUCT_COUNT="$(
  "${PSQL[@]}" postgres -Atc \
    "set role anon; select count(*) from public.products; reset role;"
)"

if [[ "$ANON_PRODUCT_COUNT" != "8" ]]; then
  echo "Anonymous storefront query returned $ANON_PRODUCT_COUNT products, expected 8." >&2
  exit 1
fi

if "${PSQL[@]}" postgres \
  -c "set role anon; select count(*) from public.inventory_levels;" \
  >/dev/null 2>&1; then
  echo "Anonymous users must not be able to read exact inventory counts." >&2
  exit 1
fi

echo "Supabase migrations validated successfully."
