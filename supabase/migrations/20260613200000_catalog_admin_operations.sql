begin;

drop policy "Content managers manage categories" on public.categories;
drop policy "Content managers manage collections" on public.collections;
drop policy "Content managers manage products" on public.products;
drop policy "Content managers manage option types" on public.option_types;
drop policy "Content managers manage option values" on public.option_values;
drop policy "Content managers manage media metadata" on public.media_assets;
drop policy "Content managers manage boxes" on public.boxes;
drop policy "Content managers manage homepage sections" on public.homepage_sections;

create policy "Content managers create categories"
on public.categories for insert
to authenticated
with check (public.can_manage_content());

create policy "Content managers update categories"
on public.categories for update
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Admins delete categories"
on public.categories for delete
to authenticated
using (public.is_admin());

create policy "Content managers create collections"
on public.collections for insert
to authenticated
with check (public.can_manage_content());

create policy "Content managers update collections"
on public.collections for update
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Admins delete collections"
on public.collections for delete
to authenticated
using (public.is_admin());

create policy "Content managers create products"
on public.products for insert
to authenticated
with check (public.can_manage_content());

create policy "Content managers update products"
on public.products for update
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Content managers create option types"
on public.option_types for insert
to authenticated
with check (public.can_manage_content());

create policy "Content managers update option types"
on public.option_types for update
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Admins delete option types"
on public.option_types for delete
to authenticated
using (public.is_admin());

create policy "Content managers create option values"
on public.option_values for insert
to authenticated
with check (public.can_manage_content());

create policy "Content managers update option values"
on public.option_values for update
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Admins delete option values"
on public.option_values for delete
to authenticated
using (public.is_admin());

create policy "Content managers create media metadata"
on public.media_assets for insert
to authenticated
with check (public.can_manage_content());

create policy "Content managers update media metadata"
on public.media_assets for update
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Admins delete media metadata"
on public.media_assets for delete
to authenticated
using (public.is_admin());

create policy "Content managers create boxes"
on public.boxes for insert
to authenticated
with check (public.can_manage_content());

create policy "Content managers update boxes"
on public.boxes for update
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Content managers create homepage sections"
on public.homepage_sections for insert
to authenticated
with check (public.can_manage_content());

create policy "Content managers update homepage sections"
on public.homepage_sections for update
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Admins delete homepage sections"
on public.homepage_sections for delete
to authenticated
using (public.is_admin());

create function public.admin_save_product(payload jsonb)
returns uuid
language plpgsql
set search_path = public, extensions, pg_temp
as $$
declare
  saved_product_id uuid;
  requested_product_id uuid;
  requested_status public.product_status;
  requested_slug text;
  requested_name text;
  requested_description text;
  requested_category_id uuid;
  requested_price numeric(10,3);
  requested_collection_ids uuid[];
  requested_color_codes text[];
  requested_size_codes text[];
  selected_option_value_ids uuid[];
  color_code text;
  size_code text;
  color_value_id uuid;
  size_value_id uuid;
  color_label text;
  size_label text;
  saved_variant_id uuid;
  generated_sku text;
  main_location_id uuid;
begin
  if not public.can_manage_content() then
    raise exception 'Staff role required' using errcode = '42501';
  end if;

  if jsonb_typeof(payload) <> 'object' then
    raise exception 'Product payload must be an object';
  end if;

  requested_product_id := nullif(payload ->> 'id', '')::uuid;
  requested_slug := lower(trim(payload ->> 'slug'));
  requested_name := trim(payload ->> 'name');
  requested_description := trim(payload ->> 'description');
  requested_category_id := nullif(payload ->> 'category_id', '')::uuid;
  requested_status := coalesce(nullif(payload ->> 'status', ''), 'draft')::public.product_status;
  requested_price := (payload ->> 'base_price_tnd')::numeric(10,3);

  select coalesce(array_agg(value::uuid), '{}'::uuid[])
  into requested_collection_ids
  from jsonb_array_elements_text(coalesce(payload -> 'collection_ids', '[]'::jsonb));

  select coalesce(array_agg(lower(trim(value))), '{}'::text[])
  into requested_color_codes
  from jsonb_array_elements_text(coalesce(payload -> 'color_codes', '[]'::jsonb));

  select coalesce(array_agg(lower(trim(value))), '{}'::text[])
  into requested_size_codes
  from jsonb_array_elements_text(coalesce(payload -> 'size_codes', '[]'::jsonb));

  if requested_slug is null
    or requested_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  then
    raise exception 'A valid product slug is required';
  end if;

  if requested_name is null or length(requested_name) < 2 then
    raise exception 'A product name is required';
  end if;

  if requested_description is null or length(requested_description) < 10 then
    raise exception 'A product description is required';
  end if;

  if requested_price is null or requested_price < 0 then
    raise exception 'A valid TND price is required';
  end if;

  if cardinality(requested_color_codes) = 0
    or cardinality(requested_size_codes) = 0
  then
    raise exception 'At least one color and size are required';
  end if;

  if requested_product_id is null then
    insert into public.products (
      slug,
      name,
      short_description,
      description,
      category_id,
      status,
      base_price_tnd,
      badges,
      is_new,
      is_best_seller,
      image_ratio,
      details,
      composition,
      fit,
      care,
      delivery_note,
      returns_note,
      seo_title,
      seo_description,
      published_at,
      created_by,
      updated_by
    )
    values (
      requested_slug,
      requested_name,
      nullif(trim(payload ->> 'short_description'), ''),
      requested_description,
      requested_category_id,
      requested_status,
      requested_price,
      coalesce(
        array(
          select trim(value)
          from jsonb_array_elements_text(coalesce(payload -> 'badges', '[]'::jsonb))
          where nullif(trim(value), '') is not null
        ),
        '{}'::text[]
      ),
      coalesce((payload ->> 'is_new')::boolean, false),
      coalesce((payload ->> 'is_best_seller')::boolean, false),
      coalesce(nullif(payload ->> 'image_ratio', ''), 'portrait')::public.image_ratio,
      nullif(trim(payload ->> 'details'), ''),
      nullif(trim(payload ->> 'composition'), ''),
      nullif(trim(payload ->> 'fit'), ''),
      nullif(trim(payload ->> 'care'), ''),
      nullif(trim(payload ->> 'delivery_note'), ''),
      nullif(trim(payload ->> 'returns_note'), ''),
      nullif(trim(payload ->> 'seo_title'), ''),
      nullif(trim(payload ->> 'seo_description'), ''),
      case
        when requested_status = 'active' then timezone('utc', now())
        else null
      end,
      auth.uid(),
      auth.uid()
    )
    returning id into saved_product_id;
  else
    update public.products
    set
      slug = requested_slug,
      name = requested_name,
      short_description = nullif(trim(payload ->> 'short_description'), ''),
      description = requested_description,
      category_id = requested_category_id,
      status = requested_status,
      base_price_tnd = requested_price,
      badges = coalesce(
        array(
          select trim(value)
          from jsonb_array_elements_text(coalesce(payload -> 'badges', '[]'::jsonb))
          where nullif(trim(value), '') is not null
        ),
        '{}'::text[]
      ),
      is_new = coalesce((payload ->> 'is_new')::boolean, false),
      is_best_seller = coalesce((payload ->> 'is_best_seller')::boolean, false),
      image_ratio = coalesce(nullif(payload ->> 'image_ratio', ''), 'portrait')::public.image_ratio,
      details = nullif(trim(payload ->> 'details'), ''),
      composition = nullif(trim(payload ->> 'composition'), ''),
      fit = nullif(trim(payload ->> 'fit'), ''),
      care = nullif(trim(payload ->> 'care'), ''),
      delivery_note = nullif(trim(payload ->> 'delivery_note'), ''),
      returns_note = nullif(trim(payload ->> 'returns_note'), ''),
      seo_title = nullif(trim(payload ->> 'seo_title'), ''),
      seo_description = nullif(trim(payload ->> 'seo_description'), ''),
      published_at = case
        when requested_status = 'active' then coalesce(published_at, timezone('utc', now()))
        else published_at
      end,
      updated_by = auth.uid()
    where id = requested_product_id
    returning id into saved_product_id;

    if saved_product_id is null then
      raise exception 'Product not found';
    end if;
  end if;

  delete from public.product_collections
  where product_id = saved_product_id;

  insert into public.product_collections (product_id, collection_id, position)
  select saved_product_id, collection_id, ordinality - 1
  from unnest(requested_collection_ids) with ordinality
    as selected_collections(collection_id, ordinality);

  insert into public.product_option_values (product_id, option_value_id, position)
  select
    saved_product_id,
    option_values.id,
    selected_values.ordinality - 1
  from unnest(requested_color_codes || requested_size_codes) with ordinality
    as selected_values(code, ordinality)
  join public.option_values on option_values.code = selected_values.code
  join public.option_types on option_types.id = option_values.option_type_id
  where option_types.code in ('color', 'size')
  on conflict (product_id, option_value_id) do update
  set position = excluded.position;

  select coalesce(array_agg(option_values.id), '{}'::uuid[])
  into selected_option_value_ids
  from public.option_values
  join public.option_types on option_types.id = option_values.option_type_id
  where (
    option_types.code = 'color'
    and option_values.code = any(requested_color_codes)
  ) or (
    option_types.code = 'size'
    and option_values.code = any(requested_size_codes)
  );

  if cardinality(selected_option_value_ids) <>
    cardinality(requested_color_codes) + cardinality(requested_size_codes)
  then
    raise exception 'One or more selected option values do not exist';
  end if;

  update public.product_variants
  set is_active = false
  where product_id = saved_product_id;

  select id into main_location_id
  from public.inventory_locations
  where code = 'main'
    and is_active;

  if main_location_id is null then
    raise exception 'Main inventory location is not configured';
  end if;

  foreach color_code in array requested_color_codes loop
    select option_values.id, option_values.label
    into color_value_id, color_label
    from public.option_values
    join public.option_types on option_types.id = option_values.option_type_id
    where option_types.code = 'color'
      and option_values.code = color_code;

    foreach size_code in array requested_size_codes loop
      select option_values.id, option_values.label
      into size_value_id, size_label
      from public.option_values
      join public.option_types on option_types.id = option_values.option_type_id
      where option_types.code = 'size'
        and option_values.code = size_code;

      generated_sku :=
        'ELAN-' || upper(substr(replace(saved_product_id::text, '-', ''), 1, 8)) ||
        '-' || upper(substr(color_code, 1, 3)) ||
        '-' || upper(replace(size_code, '-', ''));

      insert into public.product_variants (
        product_id,
        sku,
        title,
        is_active,
        position
      )
      values (
        saved_product_id,
        generated_sku,
        requested_name || ' — ' || color_label || ' / ' || size_label,
        true,
        (
          array_position(requested_color_codes, color_code) * 100 +
          array_position(requested_size_codes, size_code)
        )
      )
      on conflict (sku) do update
      set
        product_id = excluded.product_id,
        title = excluded.title,
        is_active = true,
        position = excluded.position
      returning id into saved_variant_id;

      delete from public.variant_option_values
      where variant_id = saved_variant_id;

      insert into public.variant_option_values (variant_id, option_value_id)
      values
        (saved_variant_id, color_value_id),
        (saved_variant_id, size_value_id);

      insert into public.inventory_levels (
        variant_id,
        location_id,
        stocked_quantity,
        reserved_quantity,
        low_stock_threshold
      )
      values (
        saved_variant_id,
        main_location_id,
        0,
        0,
        2
      )
      on conflict (variant_id, location_id) do nothing;
    end loop;
  end loop;

  delete from public.product_option_values
  where product_id = saved_product_id
    and not (option_value_id = any(selected_option_value_ids));

  return saved_product_id;
end;
$$;

revoke all on function public.admin_save_product(jsonb) from public;
grant execute on function public.admin_save_product(jsonb) to authenticated;

create function public.admin_adjust_inventory(
  requested_inventory_level_id uuid,
  requested_stocked_quantity integer,
  requested_low_stock_threshold integer,
  requested_note text default null
)
returns void
language plpgsql
set search_path = public, pg_temp
as $$
declare
  previous_stocked_quantity integer;
  current_reserved_quantity integer;
  quantity_delta integer;
begin
  if not public.is_admin() then
    raise exception 'Admin role required' using errcode = '42501';
  end if;

  if requested_stocked_quantity < 0 then
    raise exception 'Stocked quantity cannot be negative';
  end if;

  if requested_low_stock_threshold < 0 then
    raise exception 'Low-stock threshold cannot be negative';
  end if;

  select stocked_quantity, reserved_quantity
  into previous_stocked_quantity, current_reserved_quantity
  from public.inventory_levels
  where id = requested_inventory_level_id
  for update;

  if previous_stocked_quantity is null then
    raise exception 'Inventory level not found';
  end if;

  if requested_stocked_quantity < current_reserved_quantity then
    raise exception 'Stock cannot be lower than reserved quantity';
  end if;

  quantity_delta := requested_stocked_quantity - previous_stocked_quantity;

  update public.inventory_levels
  set
    stocked_quantity = requested_stocked_quantity,
    low_stock_threshold = requested_low_stock_threshold
  where id = requested_inventory_level_id;

  if quantity_delta <> 0 then
    insert into public.inventory_adjustments (
      inventory_level_id,
      delta,
      reason,
      note,
      reference_type,
      created_by
    )
    values (
      requested_inventory_level_id,
      quantity_delta,
      'correction',
      nullif(trim(requested_note), ''),
      'admin',
      auth.uid()
    );
  end if;
end;
$$;

revoke all on function public.admin_adjust_inventory(uuid, integer, integer, text)
from public;
grant execute on function public.admin_adjust_inventory(uuid, integer, integer, text)
to authenticated;

create function public.admin_save_box(payload jsonb)
returns uuid
language plpgsql
set search_path = public, pg_temp
as $$
declare
  saved_box_id uuid;
  requested_box_id uuid;
  requested_slug text;
  requested_name text;
  requested_description text;
  requested_occasion text;
  requested_status public.product_status;
  requested_individual_total numeric(10,3);
  requested_box_price numeric(10,3);
  requested_product_ids uuid[];
begin
  if not public.can_manage_content() then
    raise exception 'Staff role required' using errcode = '42501';
  end if;

  if jsonb_typeof(payload) <> 'object' then
    raise exception 'Box payload must be an object';
  end if;

  requested_box_id := nullif(payload ->> 'id', '')::uuid;
  requested_slug := lower(trim(payload ->> 'slug'));
  requested_name := trim(payload ->> 'name');
  requested_description := trim(payload ->> 'description');
  requested_occasion := trim(payload ->> 'occasion');
  requested_status := coalesce(nullif(payload ->> 'status', ''), 'draft')::public.product_status;
  requested_individual_total := (payload ->> 'individual_total_price_tnd')::numeric(10,3);
  requested_box_price := (payload ->> 'box_price_tnd')::numeric(10,3);

  select coalesce(array_agg(value::uuid), '{}'::uuid[])
  into requested_product_ids
  from jsonb_array_elements_text(coalesce(payload -> 'product_ids', '[]'::jsonb));

  if requested_slug is null
    or requested_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  then
    raise exception 'A valid box slug is required';
  end if;

  if requested_name is null or length(requested_name) < 2 then
    raise exception 'A box name is required';
  end if;

  if requested_description is null or length(requested_description) < 10 then
    raise exception 'A box description is required';
  end if;

  if requested_occasion is null or length(requested_occasion) < 2 then
    raise exception 'An occasion is required';
  end if;

  if requested_individual_total < 0
    or requested_box_price < 0
    or requested_box_price > requested_individual_total
  then
    raise exception 'Box pricing is invalid';
  end if;

  if cardinality(requested_product_ids) = 0 then
    raise exception 'At least one product is required';
  end if;

  if (
    select count(distinct products.id)
    from public.products
    where products.id = any(requested_product_ids)
  ) <> cardinality(requested_product_ids) then
    raise exception 'One or more selected products do not exist';
  end if;

  if requested_box_id is null then
    insert into public.boxes (
      slug,
      name,
      description,
      occasion,
      status,
      individual_total_price_tnd,
      box_price_tnd,
      placeholder_image_label,
      position,
      published_at,
      created_by,
      updated_by
    )
    values (
      requested_slug,
      requested_name,
      requested_description,
      requested_occasion,
      requested_status,
      requested_individual_total,
      requested_box_price,
      nullif(trim(payload ->> 'placeholder_image_label'), ''),
      coalesce((payload ->> 'position')::integer, 0),
      case
        when requested_status = 'active' then timezone('utc', now())
        else null
      end,
      auth.uid(),
      auth.uid()
    )
    returning id into saved_box_id;
  else
    update public.boxes
    set
      slug = requested_slug,
      name = requested_name,
      description = requested_description,
      occasion = requested_occasion,
      status = requested_status,
      individual_total_price_tnd = requested_individual_total,
      box_price_tnd = requested_box_price,
      placeholder_image_label = nullif(trim(payload ->> 'placeholder_image_label'), ''),
      position = coalesce((payload ->> 'position')::integer, position),
      published_at = case
        when requested_status = 'active' then coalesce(published_at, timezone('utc', now()))
        else published_at
      end,
      updated_by = auth.uid()
    where id = requested_box_id
    returning id into saved_box_id;

    if saved_box_id is null then
      raise exception 'Box not found';
    end if;
  end if;

  delete from public.box_items
  where box_id = saved_box_id;

  insert into public.box_items (box_id, product_id, quantity, position)
  select
    saved_box_id,
    product_id,
    1,
    ordinality - 1
  from unnest(requested_product_ids) with ordinality
    as selected_products(product_id, ordinality);

  return saved_box_id;
end;
$$;

revoke all on function public.admin_save_box(jsonb) from public;
grant execute on function public.admin_save_box(jsonb) to authenticated;

create function public.admin_delete_media_asset(requested_media_asset_id uuid)
returns jsonb
language plpgsql
set search_path = public, pg_temp
as $$
declare
  asset_bucket text;
  asset_object_path text;
begin
  if not public.is_admin() then
    raise exception 'Admin role required' using errcode = '42501';
  end if;

  select bucket, object_path
  into asset_bucket, asset_object_path
  from public.media_assets
  where id = requested_media_asset_id
  for update;

  if asset_object_path is null then
    raise exception 'Media asset not found';
  end if;

  if exists (
    select 1
    from public.product_media
    where media_asset_id = requested_media_asset_id
  ) or exists (
    select 1
    from public.homepage_section_items
    where media_asset_id = requested_media_asset_id
  ) then
    raise exception 'Media asset is still in use' using errcode = '23503';
  end if;

  delete from public.media_assets
  where id = requested_media_asset_id;

  return jsonb_build_object(
    'bucket', asset_bucket,
    'objectPath', asset_object_path
  );
end;
$$;

revoke all on function public.admin_delete_media_asset(uuid) from public;
grant execute on function public.admin_delete_media_asset(uuid) to authenticated;

create function public.admin_move_homepage_section(
  requested_section_id uuid,
  requested_direction integer
)
returns void
language plpgsql
set search_path = public, pg_temp
as $$
declare
  current_position integer;
  target_section_id uuid;
  target_position integer;
  temporary_position integer;
begin
  if not public.can_manage_content() then
    raise exception 'Staff role required' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtext('homepage_sections_order'));

  if requested_direction not in (-1, 1) then
    raise exception 'Direction must be -1 or 1';
  end if;

  select position
  into current_position
  from public.homepage_sections
  where id = requested_section_id
  for update;

  if current_position is null then
    raise exception 'Homepage section not found';
  end if;

  select id, position
  into target_section_id, target_position
  from public.homepage_sections
  where
    case
      when requested_direction = -1 then position < current_position
      else position > current_position
    end
  order by
    case when requested_direction = -1 then position end desc,
    case when requested_direction = 1 then position end asc
  limit 1
  for update;

  if target_section_id is null then
    return;
  end if;

  select coalesce(max(position), 0) + 1
  into temporary_position
  from public.homepage_sections;

  update public.homepage_sections
  set position = temporary_position
  where id = requested_section_id;

  update public.homepage_sections
  set position = current_position
  where id = target_section_id;

  update public.homepage_sections
  set position = target_position
  where id = requested_section_id;
end;
$$;

revoke all on function public.admin_move_homepage_section(uuid, integer)
from public;
grant execute on function public.admin_move_homepage_section(uuid, integer)
to authenticated;

create function public.admin_move_homepage_item(
  requested_item_id uuid,
  requested_direction integer
)
returns void
language plpgsql
set search_path = public, pg_temp
as $$
declare
  current_section_id uuid;
  current_position integer;
  target_item_id uuid;
  target_position integer;
  temporary_position integer;
begin
  if not public.can_manage_content() then
    raise exception 'Staff role required' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(
    hashtext('homepage_section_items_order:' || requested_item_id::text)
  );

  if requested_direction not in (-1, 1) then
    raise exception 'Direction must be -1 or 1';
  end if;

  select section_id, position
  into current_section_id, current_position
  from public.homepage_section_items
  where id = requested_item_id
  for update;

  if current_section_id is null then
    raise exception 'Homepage item not found';
  end if;

  perform pg_advisory_xact_lock(
    hashtext('homepage_section_items_order:' || current_section_id::text)
  );

  select id, position
  into target_item_id, target_position
  from public.homepage_section_items
  where section_id = current_section_id
    and (
      case
        when requested_direction = -1 then position < current_position
        else position > current_position
      end
    )
  order by
    case when requested_direction = -1 then position end desc,
    case when requested_direction = 1 then position end asc
  limit 1
  for update;

  if target_item_id is null then
    return;
  end if;

  select coalesce(max(position), 0) + 1
  into temporary_position
  from public.homepage_section_items
  where section_id = current_section_id;

  update public.homepage_section_items
  set position = temporary_position
  where id = requested_item_id;

  update public.homepage_section_items
  set position = current_position
  where id = target_item_id;

  update public.homepage_section_items
  set position = target_position
  where id = requested_item_id;
end;
$$;

revoke all on function public.admin_move_homepage_item(uuid, integer)
from public;
grant execute on function public.admin_move_homepage_item(uuid, integer)
to authenticated;

commit;
