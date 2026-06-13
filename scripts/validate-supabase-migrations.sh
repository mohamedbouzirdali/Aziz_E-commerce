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
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;

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

insert into auth.users (id, raw_user_meta_data)
values (
  '11111111-1111-4111-8111-111111111111',
  '{"first_name":"Test","last_name":"Admin"}'::jsonb
);

insert into public.user_roles (user_id, role)
values ('11111111-1111-4111-8111-111111111111', 'admin');

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '11111111-1111-4111-8111-111111111111',
  false
);

select public.admin_save_product(
  jsonb_build_object(
    'slug', 'migration-test-product',
    'name', 'Migration Test Product',
    'description', 'A temporary product used to verify atomic catalog administration.',
    'category_id', (select id from public.categories where slug = 'dresses'),
    'status', 'draft',
    'base_price_tnd', 199,
    'badges', jsonb_build_array('Test'),
    'is_new', true,
    'is_best_seller', false,
    'image_ratio', 'portrait',
    'collection_ids', jsonb_build_array(
      (select id from public.collections where slug = 'new-form')
    ),
    'color_codes', jsonb_build_array('black', 'ivory'),
    'size_codes', jsonb_build_array('xs', 's')
  )
);

reset role;

do $$
declare
  test_product_id uuid;
begin
  select id into test_product_id
  from public.products
  where slug = 'migration-test-product';

  if test_product_id is null then
    raise exception 'Admin product RPC did not create its product';
  end if;

  if (
    select count(*)
    from public.product_variants
    where product_id = test_product_id
      and is_active
  ) <> 4 then
    raise exception 'Admin product RPC did not create 4 active variants';
  end if;

  if (
    select count(*)
    from public.inventory_levels
    join public.product_variants
      on product_variants.id = inventory_levels.variant_id
    where product_variants.product_id = test_product_id
  ) <> 4 then
    raise exception 'Admin product RPC did not create 4 inventory levels';
  end if;
end
$$;

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '11111111-1111-4111-8111-111111111111',
  false
);

select public.admin_adjust_inventory(
  (
    select inventory_levels.id
    from public.inventory_levels
    join public.product_variants
      on product_variants.id = inventory_levels.variant_id
    where product_variants.product_id = (
      select id from public.products where slug = 'migration-test-product'
    )
      and product_variants.title like '%Black / XS'
  ),
  7,
  2,
  'Migration verification stock adjustment'
);

select public.admin_save_product(
  jsonb_build_object(
    'id', (select id from public.products where slug = 'migration-test-product'),
    'slug', 'migration-test-product',
    'name', 'Migration Test Product Updated',
    'description', 'A temporary updated product used to verify atomic catalog administration.',
    'category_id', (select id from public.categories where slug = 'dresses'),
    'status', 'draft',
    'base_price_tnd', 209,
    'badges', jsonb_build_array('Test'),
    'is_new', false,
    'is_best_seller', false,
    'image_ratio', 'portrait',
    'collection_ids', jsonb_build_array(
      (select id from public.collections where slug = 'new-form')
    ),
    'color_codes', jsonb_build_array('black'),
    'size_codes', jsonb_build_array('xs', 's', 'm')
  )
);

reset role;

do $$
declare
  test_product_id uuid;
begin
  select id into test_product_id
  from public.products
  where slug = 'migration-test-product';

  if (
    select count(*)
    from public.product_variants
    where product_id = test_product_id
      and is_active
  ) <> 3 then
    raise exception 'Admin product RPC update did not leave 3 active variants';
  end if;

  if (
    select count(*)
    from public.product_variants
    where product_id = test_product_id
  ) <> 5 then
    raise exception 'Admin product RPC update did not preserve inactive variants';
  end if;

  if (
    select sum(inventory_levels.stocked_quantity)
    from public.inventory_levels
    join public.product_variants
      on product_variants.id = inventory_levels.variant_id
    where product_variants.product_id = test_product_id
  ) <> 7 then
    raise exception 'Admin product RPC update did not preserve existing stock';
  end if;
end
$$;

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '11111111-1111-4111-8111-111111111111',
  false
);
reset role;

delete from public.inventory_adjustments
where inventory_level_id in (
  select inventory_levels.id
  from public.inventory_levels
  join public.product_variants
    on product_variants.id = inventory_levels.variant_id
  join public.products
    on products.id = product_variants.product_id
  where products.slug = 'migration-test-product'
);

delete from public.products where slug = 'migration-test-product';

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '11111111-1111-4111-8111-111111111111',
  false
);

select public.admin_save_box(
  jsonb_build_object(
    'slug', 'migration-test-box',
    'name', 'Migration Test Box',
    'description', 'A temporary box used to verify atomic box administration.',
    'occasion', 'Testing',
    'status', 'draft',
    'individual_total_price_tnd', 478,
    'box_price_tnd', 429,
    'placeholder_image_label', 'Migration test box',
    'position', 99,
    'product_ids', jsonb_build_array(
      (select id from public.products where slug = 'sculpted-midi-dress'),
      (select id from public.products where slug = 'fluid-wide-leg-trousers')
    )
  )
);

select public.admin_move_homepage_section(
  (select id from public.homepage_sections where section_key = 'hero'),
  1
);

select public.admin_move_homepage_item(
  (
    select id
    from public.homepage_section_items
    where section_id = (
      select id from public.homepage_sections where section_key = 'hero'
    )
      and position = 0
  ),
  1
);

reset role;

do $$
declare
  test_box_id uuid;
begin
  select id into test_box_id
  from public.boxes
  where slug = 'migration-test-box';

  if test_box_id is null then
    raise exception 'Admin box RPC did not create its box';
  end if;

  if (
    select count(*)
    from public.box_items
    where box_id = test_box_id
  ) <> 2 then
    raise exception 'Admin box RPC did not create 2 box items';
  end if;

  if (
    select position
    from public.homepage_sections
    where section_key = 'hero'
  ) <> 1 then
    raise exception 'Homepage section move did not swap the hero position';
  end if;

  if (
    select position
    from public.homepage_sections
    where section_key = 'shop-by-rhythm'
  ) <> 0 then
    raise exception 'Homepage section move did not swap the adjacent position';
  end if;

  if (
    select position
    from public.homepage_section_items
    where id = extensions.uuid_generate_v5(
      '3edb99f0-224a-4d81-9af8-2a1ae9b04101',
      'homepage-item:hero:0'
    )
  ) <> 1 then
    raise exception 'Homepage item move did not swap the first hero item';
  end if;

  if (
    select position
    from public.homepage_section_items
    where id = extensions.uuid_generate_v5(
      '3edb99f0-224a-4d81-9af8-2a1ae9b04101',
      'homepage-item:hero:1'
    )
  ) <> 0 then
    raise exception 'Homepage item move did not swap the adjacent hero item';
  end if;
end
$$;

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '11111111-1111-4111-8111-111111111111',
  false
);

select public.admin_move_homepage_section(
  (select id from public.homepage_sections where section_key = 'hero'),
  -1
);

select public.admin_move_homepage_item(
  (
    select id
    from public.homepage_section_items
    where section_id = (
      select id from public.homepage_sections where section_key = 'hero'
    )
      and placeholder_label = 'Full-length campaign portrait'
  ),
  -1
);

reset role;

do $$
begin
  if (
    select position
    from public.homepage_sections
    where section_key = 'hero'
  ) <> 0 then
    raise exception 'Homepage section move did not restore its original order';
  end if;

  if (
    select position
    from public.homepage_section_items
    where id = extensions.uuid_generate_v5(
      '3edb99f0-224a-4d81-9af8-2a1ae9b04101',
      'homepage-item:hero:0'
    )
  ) <> 0 then
    raise exception 'Homepage item move did not restore its original order';
  end if;
end
$$;

delete from public.boxes where slug = 'migration-test-box';

insert into auth.users (id, raw_user_meta_data)
values (
  '22222222-2222-4222-8222-222222222222',
  '{"first_name":"Test","last_name":"Editor"}'::jsonb
);

insert into public.user_roles (user_id, role)
values ('22222222-2222-4222-8222-222222222222', 'editor');

insert into public.media_assets (
  id,
  object_path,
  alt_text,
  mime_type,
  file_size_bytes
)
values (
  '33333333-3333-4333-8333-333333333333',
  'migration-tests/admin-delete.webp',
  'Temporary migration validation image',
  'image/webp',
  1024
);

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '22222222-2222-4222-8222-222222222222',
  false
);
delete from public.categories where slug = 'dresses';

do $$
begin
  perform public.admin_adjust_inventory(
    (select id from public.inventory_levels limit 1),
    1,
    2,
    'Editor must not be allowed'
  );
  raise exception 'Editors must not be able to adjust inventory';
exception
  when insufficient_privilege then
    null;
end
$$;

do $$
begin
  perform public.admin_delete_media_asset(
    '33333333-3333-4333-8333-333333333333'
  );
  raise exception 'Editors must not be able to delete media assets';
exception
  when insufficient_privilege then
    null;
end
$$;

reset role;

set role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '11111111-1111-4111-8111-111111111111',
  false
);

select public.admin_delete_media_asset(
  '33333333-3333-4333-8333-333333333333'
);

reset role;

do $$
begin
  if not exists (select 1 from public.categories where slug = 'dresses') then
    raise exception 'Editors must not be able to delete core categories';
  end if;

  if exists (select 1 from public.products where slug = 'migration-test-product') then
    raise exception 'Admin product RPC test cleanup failed';
  end if;

  if exists (
    select 1
    from public.media_assets
    where id = '33333333-3333-4333-8333-333333333333'
  ) then
    raise exception 'Admin media delete RPC test cleanup failed';
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
