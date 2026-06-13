begin;

create schema if not exists extensions;

create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists pg_trgm with schema extensions;

create type public.app_role as enum ('customer', 'editor', 'admin');
create type public.product_status as enum ('draft', 'active', 'archived');
create type public.image_ratio as enum ('portrait', 'square', 'landscape');
create type public.homepage_section_type as enum (
  'hero',
  'product_grid',
  'category_grid',
  'editorial',
  'slider',
  'boxes',
  'services',
  'newsletter'
);
create type public.content_theme as enum ('light', 'dark', 'off_white');
create type public.inventory_adjustment_reason as enum (
  'initial',
  'restock',
  'sale',
  'return',
  'damage',
  'correction',
  'reservation',
  'release'
);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  avatar_path text,
  marketing_consent boolean not null default false,
  marketing_consent_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_marketing_consent_time check (
    marketing_consent = false or marketing_consent_at is not null
  )
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, role)
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', '')
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'customer')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  placeholder_image_label text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint categories_position_nonnegative check (position >= 0)
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint collections_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint collections_position_nonnegative check (position >= 0)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  description text not null,
  category_id uuid references public.categories(id) on delete set null,
  status public.product_status not null default 'draft',
  base_price_tnd numeric(10,3) not null,
  currency_code text not null default 'TND',
  badges text[] not null default '{}',
  is_new boolean not null default false,
  is_best_seller boolean not null default false,
  image_ratio public.image_ratio not null default 'portrait',
  details text,
  composition text,
  fit text,
  care text,
  delivery_note text,
  returns_note text,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint products_price_nonnegative check (base_price_tnd >= 0),
  constraint products_currency_tnd check (currency_code = 'TND'),
  constraint products_active_has_publish_date check (
    status <> 'active' or published_at is not null
  )
);

create table public.product_collections (
  product_id uuid not null references public.products(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (product_id, collection_id),
  constraint product_collections_position_nonnegative check (position >= 0)
);

create table public.option_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  constraint option_types_code_format check (code ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint option_types_position_nonnegative check (position >= 0)
);

create table public.option_values (
  id uuid primary key default gen_random_uuid(),
  option_type_id uuid not null references public.option_types(id) on delete cascade,
  code text not null,
  label text not null,
  swatch_hex text,
  metadata jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  unique (option_type_id, code),
  constraint option_values_code_format check (code ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint option_values_swatch_hex check (
    swatch_hex is null or swatch_hex ~ '^#[0-9A-Fa-f]{6}$'
  ),
  constraint option_values_position_nonnegative check (position >= 0),
  constraint option_values_metadata_object check (jsonb_typeof(metadata) = 'object')
);

create table public.product_option_values (
  product_id uuid not null references public.products(id) on delete cascade,
  option_value_id uuid not null references public.option_values(id) on delete restrict,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (product_id, option_value_id),
  constraint product_option_values_position_nonnegative check (position >= 0)
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  barcode text unique,
  title text not null,
  price_tnd numeric(10,3),
  compare_at_price_tnd numeric(10,3),
  manage_inventory boolean not null default true,
  is_active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint product_variants_price_nonnegative check (
    price_tnd is null or price_tnd >= 0
  ),
  constraint product_variants_compare_price_nonnegative check (
    compare_at_price_tnd is null or compare_at_price_tnd >= 0
  ),
  constraint product_variants_compare_price_order check (
    compare_at_price_tnd is null
    or price_tnd is null
    or compare_at_price_tnd >= price_tnd
  ),
  constraint product_variants_position_nonnegative check (position >= 0)
);

create table public.variant_option_values (
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  option_value_id uuid not null references public.option_values(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (variant_id, option_value_id)
);

create function public.validate_variant_option_value()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  variant_product_id uuid;
  incoming_option_type_id uuid;
begin
  select product_id into variant_product_id
  from public.product_variants
  where id = new.variant_id;

  if not exists (
    select 1
    from public.product_option_values
    where product_id = variant_product_id
      and option_value_id = new.option_value_id
  ) then
    raise exception 'Option value is not enabled for this product';
  end if;

  select option_type_id into incoming_option_type_id
  from public.option_values
  where id = new.option_value_id;

  if exists (
    select 1
    from public.variant_option_values existing
    join public.option_values existing_value
      on existing_value.id = existing.option_value_id
    where existing.variant_id = new.variant_id
      and existing_value.option_type_id = incoming_option_type_id
      and existing.option_value_id <> new.option_value_id
  ) then
    raise exception 'Variant already has a value for this option type';
  end if;

  return new;
end;
$$;

create trigger validate_variant_option_value_before_write
before insert or update on public.variant_option_values
for each row execute procedure public.validate_variant_option_value();

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'catalog-media',
  object_path text not null,
  alt_text text not null,
  width integer,
  height integer,
  mime_type text,
  file_size_bytes bigint,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (bucket, object_path),
  constraint media_assets_alt_text_present check (length(trim(alt_text)) > 0),
  constraint media_assets_dimensions_positive check (
    (width is null or width > 0) and (height is null or height > 0)
  ),
  constraint media_assets_size_nonnegative check (
    file_size_bytes is null or file_size_bytes >= 0
  )
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  option_value_id uuid references public.option_values(id) on delete restrict,
  media_asset_id uuid references public.media_assets(id) on delete restrict,
  placeholder_label text,
  role text not null default 'gallery',
  position integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  constraint product_media_source_present check (
    media_asset_id is not null or nullif(trim(placeholder_label), '') is not null
  ),
  constraint product_media_role_allowed check (
    role in ('card', 'gallery', 'detail', 'box', 'social')
  ),
  constraint product_media_position_nonnegative check (position >= 0)
);

create unique index product_media_one_primary_per_product
on public.product_media(product_id)
where is_primary and variant_id is null and option_value_id is null;

create table public.inventory_locations (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint inventory_locations_code_format check (
    code ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  )
);

create table public.inventory_levels (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  location_id uuid not null references public.inventory_locations(id) on delete restrict,
  stocked_quantity integer not null default 0,
  reserved_quantity integer not null default 0,
  low_stock_threshold integer not null default 2,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (variant_id, location_id),
  constraint inventory_levels_stock_nonnegative check (stocked_quantity >= 0),
  constraint inventory_levels_reserved_nonnegative check (reserved_quantity >= 0),
  constraint inventory_levels_reservation_within_stock check (
    reserved_quantity <= stocked_quantity
  ),
  constraint inventory_levels_threshold_nonnegative check (low_stock_threshold >= 0)
);

create table public.inventory_adjustments (
  id uuid primary key default gen_random_uuid(),
  inventory_level_id uuid not null references public.inventory_levels(id) on delete restrict,
  delta integer not null,
  reason public.inventory_adjustment_reason not null,
  note text,
  reference_type text,
  reference_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint inventory_adjustments_nonzero check (delta <> 0)
);

create table public.boxes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  occasion text not null,
  status public.product_status not null default 'draft',
  individual_total_price_tnd numeric(10,3) not null,
  box_price_tnd numeric(10,3) not null,
  placeholder_image_label text,
  position integer not null default 0,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint boxes_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint boxes_prices_nonnegative check (
    individual_total_price_tnd >= 0 and box_price_tnd >= 0
  ),
  constraint boxes_discount_valid check (
    box_price_tnd <= individual_total_price_tnd
  ),
  constraint boxes_position_nonnegative check (position >= 0),
  constraint boxes_active_has_publish_date check (
    status <> 'active' or published_at is not null
  )
);

create table public.box_items (
  box_id uuid not null references public.boxes(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (box_id, product_id),
  constraint box_items_quantity_positive check (quantity > 0),
  constraint box_items_position_nonnegative check (position >= 0)
);

create table public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  section_type public.homepage_section_type not null,
  eyebrow text,
  heading text,
  body text,
  theme public.content_theme not null default 'light',
  position integer not null,
  is_visible boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint homepage_sections_key_format check (
    section_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint homepage_sections_position_nonnegative check (position >= 0),
  constraint homepage_sections_settings_object check (jsonb_typeof(settings) = 'object')
);

create unique index homepage_sections_unique_position
on public.homepage_sections(position);

create table public.homepage_section_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.homepage_sections(id) on delete cascade,
  product_id uuid references public.products(id) on delete restrict,
  box_id uuid references public.boxes(id) on delete restrict,
  media_asset_id uuid references public.media_assets(id) on delete restrict,
  placeholder_label text,
  title_override text,
  body_override text,
  cta_label text,
  cta_href text,
  position integer not null default 0,
  is_visible boolean not null default true,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (section_id, position),
  constraint homepage_section_items_single_target check (
    num_nonnulls(product_id, box_id, media_asset_id) <= 1
  ),
  constraint homepage_section_items_content_present check (
    num_nonnulls(product_id, box_id, media_asset_id) = 1
    or nullif(trim(placeholder_label), '') is not null
    or nullif(trim(title_override), '') is not null
  ),
  constraint homepage_section_items_position_nonnegative check (position >= 0),
  constraint homepage_section_items_settings_object check (jsonb_typeof(settings) = 'object')
);

create table public.admin_audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  table_name text not null,
  record_id text,
  action text not null,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  constraint admin_audit_logs_action_allowed check (
    action in ('INSERT', 'UPDATE', 'DELETE')
  )
);

create function public.log_admin_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  old_row jsonb;
  new_row jsonb;
  row_id text;
begin
  old_row := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end;
  new_row := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end;
  row_id := coalesce(new_row ->> 'id', old_row ->> 'id');

  insert into public.admin_audit_logs (
    actor_id,
    table_name,
    record_id,
    action,
    old_data,
    new_data
  )
  values (
    auth.uid(),
    tg_table_name,
    row_id,
    tg_op,
    old_row,
    new_row
  );

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger categories_set_updated_at
before update on public.categories
for each row execute procedure public.set_updated_at();

create trigger collections_set_updated_at
before update on public.collections
for each row execute procedure public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute procedure public.set_updated_at();

create trigger product_variants_set_updated_at
before update on public.product_variants
for each row execute procedure public.set_updated_at();

create trigger media_assets_set_updated_at
before update on public.media_assets
for each row execute procedure public.set_updated_at();

create trigger inventory_locations_set_updated_at
before update on public.inventory_locations
for each row execute procedure public.set_updated_at();

create trigger inventory_levels_set_updated_at
before update on public.inventory_levels
for each row execute procedure public.set_updated_at();

create trigger boxes_set_updated_at
before update on public.boxes
for each row execute procedure public.set_updated_at();

create trigger homepage_sections_set_updated_at
before update on public.homepage_sections
for each row execute procedure public.set_updated_at();

create trigger homepage_section_items_set_updated_at
before update on public.homepage_section_items
for each row execute procedure public.set_updated_at();

create trigger categories_audit
after insert or update or delete on public.categories
for each row execute procedure public.log_admin_change();

create trigger collections_audit
after insert or update or delete on public.collections
for each row execute procedure public.log_admin_change();

create trigger products_audit
after insert or update or delete on public.products
for each row execute procedure public.log_admin_change();

create trigger product_variants_audit
after insert or update or delete on public.product_variants
for each row execute procedure public.log_admin_change();

create trigger media_assets_audit
after insert or update or delete on public.media_assets
for each row execute procedure public.log_admin_change();

create trigger inventory_levels_audit
after insert or update or delete on public.inventory_levels
for each row execute procedure public.log_admin_change();

create trigger boxes_audit
after insert or update or delete on public.boxes
for each row execute procedure public.log_admin_change();

create trigger homepage_sections_audit
after insert or update or delete on public.homepage_sections
for each row execute procedure public.log_admin_change();

create trigger homepage_section_items_audit
after insert or update or delete on public.homepage_section_items
for each row execute procedure public.log_admin_change();

create index categories_active_position_idx
on public.categories(is_active, position);

create index collections_active_position_idx
on public.collections(is_active, position);

create index products_status_published_idx
on public.products(status, published_at desc);

create index products_category_status_idx
on public.products(category_id, status);

create index products_name_trgm_idx
on public.products using gin (name extensions.gin_trgm_ops);

create index products_description_trgm_idx
on public.products using gin (description extensions.gin_trgm_ops);

create index product_collections_collection_idx
on public.product_collections(collection_id, position);

create index product_option_values_value_idx
on public.product_option_values(option_value_id, product_id);

create index product_variants_product_active_idx
on public.product_variants(product_id, is_active, position);

create index variant_option_values_value_idx
on public.variant_option_values(option_value_id, variant_id);

create index product_media_product_position_idx
on public.product_media(product_id, position);

create index inventory_levels_variant_idx
on public.inventory_levels(variant_id, location_id);

create index inventory_adjustments_level_created_idx
on public.inventory_adjustments(inventory_level_id, created_at desc);

create index boxes_status_position_idx
on public.boxes(status, position);

create index box_items_product_idx
on public.box_items(product_id);

create index homepage_sections_visible_position_idx
on public.homepage_sections(is_visible, position);

create index homepage_section_items_section_position_idx
on public.homepage_section_items(section_id, position);

create index admin_audit_logs_actor_created_idx
on public.admin_audit_logs(actor_id, created_at desc);

create index admin_audit_logs_table_record_idx
on public.admin_audit_logs(table_name, record_id, created_at desc);

commit;
