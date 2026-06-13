begin;

-- Stable IDs let application references and repeated development seeds converge.
create temporary table seed_product_matrix (
  slug text primary key,
  product_code text not null,
  color_codes text[] not null,
  size_codes text[] not null,
  unavailable_size_codes text[] not null,
  stock_state text not null
) on commit drop;

insert into public.categories (
  id,
  slug,
  name,
  description,
  placeholder_image_label,
  position,
  is_active
)
values
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'category:dresses'), 'dresses', 'Dresses', 'Clean lines for everyday and evening.', 'Dresses editorial', 0, true),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'category:tailoring'), 'tailoring', 'Tailoring', 'Modern structure with an easy point of view.', 'Tailoring editorial', 1, true),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'category:tops'), 'tops', 'Tops', 'Refined foundations for a considered wardrobe.', 'Tops editorial', 2, true),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'category:bottoms'), 'bottoms', 'Bottoms', 'Fluid trousers and versatile skirts.', 'Bottoms editorial', 3, true),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'category:sets'), 'sets', 'Sets', 'Coordinated pieces, styled together or apart.', 'Sets editorial', 4, true),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'category:accessories'), 'accessories', 'Accessories', 'The final, intentional detail.', 'Accessories editorial', 5, true)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  placeholder_image_label = excluded.placeholder_image_label,
  position = excluded.position,
  is_active = excluded.is_active;

insert into public.collections (
  id,
  slug,
  name,
  description,
  position,
  is_active
)
values
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'collection:new-form'), 'new-form', 'New Form', 'A study in soft structure and modern proportion.', 0, true),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'collection:after-dark'), 'after-dark', 'After Dark', 'Quietly expressive pieces for evening.', 1, true),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'collection:everyday-edit'), 'everyday-edit', 'Everyday Edit', 'Elevated foundations for repeat wear.', 2, true)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  position = excluded.position,
  is_active = excluded.is_active;

insert into public.option_types (id, code, name, position)
values
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-type:color'), 'color', 'Color', 0),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-type:size'), 'size', 'Size', 1)
on conflict (code) do update
set name = excluded.name, position = excluded.position;

insert into public.option_values (
  id,
  option_type_id,
  code,
  label,
  swatch_hex,
  position
)
values
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-value:color:black'), (select id from public.option_types where code = 'color'), 'black', 'Black', '#111111', 0),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-value:color:ivory'), (select id from public.option_types where code = 'color'), 'ivory', 'Ivory', '#F3EFE5', 1),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-value:color:stone'), (select id from public.option_types where code = 'color'), 'stone', 'Stone', '#B9B1A5', 2),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-value:color:charcoal'), (select id from public.option_types where code = 'color'), 'charcoal', 'Charcoal', '#383838', 3),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-value:color:burgundy'), (select id from public.option_types where code = 'color'), 'burgundy', 'Burgundy', '#5A1E2A', 4),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-value:color:beige'), (select id from public.option_types where code = 'color'), 'beige', 'Beige', '#D9C9B7', 5),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-value:size:xs'), (select id from public.option_types where code = 'size'), 'xs', 'XS', null, 0),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-value:size:s'), (select id from public.option_types where code = 'size'), 's', 'S', null, 1),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-value:size:m'), (select id from public.option_types where code = 'size'), 'm', 'M', null, 2),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-value:size:l'), (select id from public.option_types where code = 'size'), 'l', 'L', null, 3),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-value:size:xl'), (select id from public.option_types where code = 'size'), 'xl', 'XL', null, 4),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'option-value:size:one-size'), (select id from public.option_types where code = 'size'), 'one-size', 'One Size', null, 5)
on conflict (option_type_id, code) do update
set
  label = excluded.label,
  swatch_hex = excluded.swatch_hex,
  position = excluded.position;

insert into public.products (
  id,
  slug,
  name,
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
  published_at
)
values
  (
    extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'product:sculpted-midi-dress'),
    'sculpted-midi-dress',
    'Sculpted Midi Dress',
    'A softly structured midi dress with a defined waist and fluid skirt.',
    (select id from public.categories where slug = 'dresses'),
    'active',
    289,
    array['New'],
    true,
    false,
    'portrait',
    'Midi length, concealed back zip, lightly shaped bodice.',
    '72% viscose, 28% linen.',
    'Fitted through the bodice with a relaxed skirt.',
    'Follow the care label. Store in a cool, dry place.',
    'Delivery across Tunisia in 2-5 business days.',
    'Returns accepted within 14 days in original condition.',
    '2026-06-01T00:00:00Z'
  ),
  (
    extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'product:relaxed-linen-blazer'),
    'relaxed-linen-blazer',
    'Relaxed Linen Blazer',
    'Single-breasted tailoring with a relaxed shoulder and clean finish.',
    (select id from public.categories where slug = 'tailoring'),
    'active',
    329,
    array['Best Seller'],
    false,
    true,
    'portrait',
    'Notched lapels, single-button closure, two front pockets.',
    '55% linen, 45% viscose.',
    'Relaxed fit. Choose your usual size.',
    'Follow the care label. Store in a cool, dry place.',
    'Delivery across Tunisia in 2-5 business days.',
    'Returns accepted within 14 days in original condition.',
    '2026-05-01T00:00:00Z'
  ),
  (
    extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'product:fluid-wide-leg-trousers'),
    'fluid-wide-leg-trousers',
    'Fluid Wide-Leg Trousers',
    'High-rise trousers with precise pleats and an elongated silhouette.',
    (select id from public.categories where slug = 'bottoms'),
    'active',
    189,
    array[]::text[],
    false,
    true,
    'portrait',
    'High rise, front pleats, side pockets, full length.',
    '64% recycled polyester, 33% viscose, 3% elastane.',
    'Regular waist with a generous wide leg.',
    'Follow the care label. Store in a cool, dry place.',
    'Delivery across Tunisia in 2-5 business days.',
    'Returns accepted within 14 days in original condition.',
    '2026-04-15T00:00:00Z'
  ),
  (
    extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'product:draped-neck-top'),
    'draped-neck-top',
    'Draped-Neck Top',
    'A refined sleeveless top with a softly draped neckline.',
    (select id from public.categories where slug = 'tops'),
    'active',
    129,
    array['New'],
    true,
    false,
    'portrait',
    'Sleeveless, draped neckline, straight hem.',
    '100% viscose.',
    'Skims the body without clinging.',
    'Follow the care label. Store in a cool, dry place.',
    'Delivery across Tunisia in 2-5 business days.',
    'Returns accepted within 14 days in original condition.',
    '2026-06-05T00:00:00Z'
  ),
  (
    extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'product:column-knit-dress'),
    'column-knit-dress',
    'Column Knit Dress',
    'A long ribbed silhouette balanced by a clean square neckline.',
    (select id from public.categories where slug = 'dresses'),
    'active',
    249,
    array['Limited'],
    false,
    true,
    'portrait',
    'Maxi length, square neck, fine rib knit.',
    '70% viscose, 30% recycled polyamide.',
    'Close fit with comfortable stretch.',
    'Follow the care label. Store in a cool, dry place.',
    'Delivery across Tunisia in 2-5 business days.',
    'Returns accepted within 14 days in original condition.',
    '2026-04-01T00:00:00Z'
  ),
  (
    extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'product:minimal-shoulder-bag'),
    'minimal-shoulder-bag',
    'Minimal Shoulder Bag',
    'A compact everyday bag with a curved profile and discreet closure.',
    (select id from public.categories where slug = 'accessories'),
    'active',
    159,
    array[]::text[],
    true,
    false,
    'portrait',
    'Adjustable strap, magnetic closure, internal slip pocket.',
    'Recycled polyurethane outer, cotton lining.',
    'Width 26 cm, height 15 cm, depth 8 cm.',
    'Follow the care label. Store in a cool, dry place.',
    'Delivery across Tunisia in 2-5 business days.',
    'Returns accepted within 14 days in original condition.',
    '2026-06-03T00:00:00Z'
  ),
  (
    extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'product:soft-tailored-waistcoat'),
    'soft-tailored-waistcoat',
    'Soft Tailored Waistcoat',
    'Longline waistcoat with subtle shaping and covered buttons.',
    (select id from public.categories where slug = 'tailoring'),
    'active',
    179,
    array['New'],
    true,
    false,
    'portrait',
    'V-neck, covered buttons, welt pockets.',
    '68% viscose, 28% linen, 4% elastane.',
    'Longline, lightly fitted silhouette.',
    'Follow the care label. Store in a cool, dry place.',
    'Delivery across Tunisia in 2-5 business days.',
    'Returns accepted within 14 days in original condition.',
    '2026-06-02T00:00:00Z'
  ),
  (
    extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'product:asymmetric-satin-skirt'),
    'asymmetric-satin-skirt',
    'Asymmetric Satin Skirt',
    'A fluid satin skirt cut on the bias with an asymmetric hem.',
    (select id from public.categories where slug = 'bottoms'),
    'active',
    169,
    array[]::text[],
    false,
    false,
    'portrait',
    'Bias cut, concealed side zip, asymmetric midi hem.',
    '100% recycled polyester.',
    'Regular waist with a fluid fit.',
    'Follow the care label. Store in a cool, dry place.',
    'Delivery across Tunisia in 2-5 business days.',
    'Returns accepted within 14 days in original condition.',
    '2026-03-15T00:00:00Z'
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  category_id = excluded.category_id,
  status = excluded.status,
  base_price_tnd = excluded.base_price_tnd,
  badges = excluded.badges,
  is_new = excluded.is_new,
  is_best_seller = excluded.is_best_seller,
  image_ratio = excluded.image_ratio,
  details = excluded.details,
  composition = excluded.composition,
  fit = excluded.fit,
  care = excluded.care,
  delivery_note = excluded.delivery_note,
  returns_note = excluded.returns_note,
  published_at = excluded.published_at;

insert into public.product_collections (product_id, collection_id, position)
values
  ((select id from public.products where slug = 'sculpted-midi-dress'), (select id from public.collections where slug = 'new-form'), 0),
  ((select id from public.products where slug = 'relaxed-linen-blazer'), (select id from public.collections where slug = 'new-form'), 1),
  ((select id from public.products where slug = 'fluid-wide-leg-trousers'), (select id from public.collections where slug = 'everyday-edit'), 0),
  ((select id from public.products where slug = 'draped-neck-top'), (select id from public.collections where slug = 'after-dark'), 0),
  ((select id from public.products where slug = 'column-knit-dress'), (select id from public.collections where slug = 'after-dark'), 1),
  ((select id from public.products where slug = 'minimal-shoulder-bag'), (select id from public.collections where slug = 'everyday-edit'), 1),
  ((select id from public.products where slug = 'soft-tailored-waistcoat'), (select id from public.collections where slug = 'new-form'), 2),
  ((select id from public.products where slug = 'asymmetric-satin-skirt'), (select id from public.collections where slug = 'after-dark'), 2)
on conflict (product_id, collection_id) do update
set position = excluded.position;

insert into seed_product_matrix (
  slug,
  product_code,
  color_codes,
  size_codes,
  unavailable_size_codes,
  stock_state
)
values
  ('sculpted-midi-dress', 'P001', array['black', 'ivory'], array['xs', 's', 'm', 'l'], array['xs'], 'in-stock'),
  ('relaxed-linen-blazer', 'P002', array['charcoal', 'stone'], array['xs', 's', 'm', 'l', 'xl'], array['xl'], 'low-stock'),
  ('fluid-wide-leg-trousers', 'P003', array['black', 'stone'], array['xs', 's', 'm', 'l', 'xl'], array[]::text[], 'in-stock'),
  ('draped-neck-top', 'P004', array['ivory', 'burgundy', 'black'], array['xs', 's', 'm', 'l'], array['l'], 'in-stock'),
  ('column-knit-dress', 'P005', array['black', 'burgundy'], array['xs', 's', 'm', 'l'], array['s'], 'low-stock'),
  ('minimal-shoulder-bag', 'P006', array['black', 'stone'], array['one-size'], array[]::text[], 'in-stock'),
  ('soft-tailored-waistcoat', 'P007', array['ivory', 'charcoal'], array['xs', 's', 'm', 'l'], array[]::text[], 'in-stock'),
  ('asymmetric-satin-skirt', 'P008', array['black', 'burgundy'], array['xs', 's', 'm', 'l', 'xl'], array['xs', 'xl'], 'in-stock');

insert into public.product_option_values (product_id, option_value_id, position)
select
  products.id,
  option_values.id,
  color.ordinality - 1
from seed_product_matrix
join public.products on products.slug = seed_product_matrix.slug
cross join lateral unnest(seed_product_matrix.color_codes) with ordinality as color(code, ordinality)
join public.option_types on option_types.code = 'color'
join public.option_values
  on option_values.option_type_id = option_types.id
  and option_values.code = color.code
union all
select
  products.id,
  option_values.id,
  size.ordinality - 1
from seed_product_matrix
join public.products on products.slug = seed_product_matrix.slug
cross join lateral unnest(seed_product_matrix.size_codes) with ordinality as size(code, ordinality)
join public.option_types on option_types.code = 'size'
join public.option_values
  on option_values.option_type_id = option_types.id
  and option_values.code = size.code
on conflict (product_id, option_value_id) do update
set position = excluded.position;

insert into public.product_variants (
  id,
  product_id,
  sku,
  title,
  is_active,
  position
)
select
  extensions.uuid_generate_v5(
    '3edb99f0-224a-4d81-9af8-2a1ae9b04101',
    'variant:' || seed_product_matrix.slug || ':' || color.code || ':' || size.code
  ),
  products.id,
  'ELAN-' || seed_product_matrix.product_code || '-' ||
    upper(left(color.code, 3)) || '-' || upper(replace(size.code, '-', '')),
  products.name || ' — ' || color_value.label || ' / ' || size_value.label,
  true,
  ((color.ordinality - 1) * 10 + size.ordinality - 1)::integer
from seed_product_matrix
join public.products on products.slug = seed_product_matrix.slug
cross join lateral unnest(seed_product_matrix.color_codes) with ordinality as color(code, ordinality)
cross join lateral unnest(seed_product_matrix.size_codes) with ordinality as size(code, ordinality)
join public.option_types color_type on color_type.code = 'color'
join public.option_values color_value
  on color_value.option_type_id = color_type.id
  and color_value.code = color.code
join public.option_types size_type on size_type.code = 'size'
join public.option_values size_value
  on size_value.option_type_id = size_type.id
  and size_value.code = size.code
on conflict (sku) do update
set
  product_id = excluded.product_id,
  title = excluded.title,
  is_active = excluded.is_active,
  position = excluded.position;

insert into public.variant_option_values (variant_id, option_value_id)
select
  variants.id,
  option_values.id
from seed_product_matrix
join public.products on products.slug = seed_product_matrix.slug
cross join lateral unnest(seed_product_matrix.color_codes) as color(code)
cross join lateral unnest(seed_product_matrix.size_codes) as size(code)
join public.product_variants variants
  on variants.product_id = products.id
  and variants.sku = (
    'ELAN-' || seed_product_matrix.product_code || '-' ||
    upper(left(color.code, 3)) || '-' || upper(replace(size.code, '-', ''))
  )
join public.option_types on option_types.code = 'color'
join public.option_values
  on option_values.option_type_id = option_types.id
  and option_values.code = color.code
union all
select
  variants.id,
  option_values.id
from seed_product_matrix
join public.products on products.slug = seed_product_matrix.slug
cross join lateral unnest(seed_product_matrix.color_codes) as color(code)
cross join lateral unnest(seed_product_matrix.size_codes) as size(code)
join public.product_variants variants
  on variants.product_id = products.id
  and variants.sku = (
    'ELAN-' || seed_product_matrix.product_code || '-' ||
    upper(left(color.code, 3)) || '-' || upper(replace(size.code, '-', ''))
  )
join public.option_types on option_types.code = 'size'
join public.option_values
  on option_values.option_type_id = option_types.id
  and option_values.code = size.code
on conflict (variant_id, option_value_id) do nothing;

insert into public.product_media (
  id,
  product_id,
  option_value_id,
  placeholder_label,
  role,
  position,
  is_primary
)
select
  extensions.uuid_generate_v5(
    '3edb99f0-224a-4d81-9af8-2a1ae9b04101',
    'product-media:' || seed_product_matrix.slug || ':' || color.code
  ),
  products.id,
  option_values.id,
  products.name || ' — ' || option_values.label || ' view',
  case when color.ordinality = 1 then 'card' else 'gallery' end,
  color.ordinality - 1,
  color.ordinality = 1
from seed_product_matrix
join public.products on products.slug = seed_product_matrix.slug
cross join lateral unnest(seed_product_matrix.color_codes) with ordinality as color(code, ordinality)
join public.option_types on option_types.code = 'color'
join public.option_values
  on option_values.option_type_id = option_types.id
  and option_values.code = color.code
on conflict (id) do update
set
  option_value_id = excluded.option_value_id,
  placeholder_label = excluded.placeholder_label,
  role = excluded.role,
  position = excluded.position,
  is_primary = excluded.is_primary;

insert into public.inventory_locations (id, code, name, is_active)
values (
  extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'inventory-location:main'),
  'main',
  'Main inventory',
  true
)
on conflict (code) do update
set name = excluded.name, is_active = excluded.is_active;

insert into public.inventory_levels (
  id,
  variant_id,
  location_id,
  stocked_quantity,
  reserved_quantity,
  low_stock_threshold
)
select
  extensions.uuid_generate_v5(
    '3edb99f0-224a-4d81-9af8-2a1ae9b04101',
    'inventory:' || variants.sku || ':main'
  ),
  variants.id,
  (select id from public.inventory_locations where code = 'main'),
  case
    when size.code = any(seed_product_matrix.unavailable_size_codes) then 0
    when seed_product_matrix.stock_state = 'low-stock' then 2
    else 8
  end,
  0,
  2
from seed_product_matrix
join public.products on products.slug = seed_product_matrix.slug
cross join lateral unnest(seed_product_matrix.color_codes) as color(code)
cross join lateral unnest(seed_product_matrix.size_codes) as size(code)
join public.product_variants variants
  on variants.product_id = products.id
  and variants.sku = (
    'ELAN-' || seed_product_matrix.product_code || '-' ||
    upper(left(color.code, 3)) || '-' || upper(replace(size.code, '-', ''))
  )
on conflict (variant_id, location_id) do nothing;

insert into public.inventory_adjustments (
  id,
  inventory_level_id,
  delta,
  reason,
  note,
  reference_type
)
select
  extensions.uuid_generate_v5(
    '3edb99f0-224a-4d81-9af8-2a1ae9b04101',
    'inventory-adjustment:' || inventory_levels.id::text || ':initial'
  ),
  inventory_levels.id,
  inventory_levels.stocked_quantity,
  'initial',
  'Initial storefront seed',
  'seed'
from public.inventory_levels
join public.inventory_locations
  on inventory_locations.id = inventory_levels.location_id
where inventory_locations.code = 'main'
  and inventory_levels.stocked_quantity > 0
on conflict (id) do nothing;

insert into public.boxes (
  id,
  slug,
  name,
  description,
  occasion,
  status,
  individual_total_price_tnd,
  box_price_tnd,
  placeholder_image_label,
  position,
  published_at
)
values
  (
    extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'box:modern-workday-box'),
    'modern-workday-box',
    'Modern Workday Box',
    'A complete tailored foundation for polished weekdays.',
    'Work',
    'active',
    647,
    569,
    'Three-piece workday capsule',
    0,
    '2026-06-01T00:00:00Z'
  ),
  (
    extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'box:evening-edit-box'),
    'evening-edit-box',
    'Evening Edit Box',
    'A considered after-dark pairing with one finishing accent.',
    'Evening',
    'active',
    577,
    499,
    'Evening capsule flat lay',
    1,
    '2026-06-01T00:00:00Z'
  ),
  (
    extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'box:weekend-light-box'),
    'weekend-light-box',
    'Weekend Light Box',
    'Easy layers for warm afternoons and unhurried plans.',
    'Weekend',
    'active',
    627,
    549,
    'Weekend wardrobe capsule',
    2,
    '2026-06-01T00:00:00Z'
  )
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  occasion = excluded.occasion,
  status = excluded.status,
  individual_total_price_tnd = excluded.individual_total_price_tnd,
  box_price_tnd = excluded.box_price_tnd,
  placeholder_image_label = excluded.placeholder_image_label,
  position = excluded.position,
  published_at = excluded.published_at;

insert into public.box_items (box_id, product_id, quantity, position)
values
  ((select id from public.boxes where slug = 'modern-workday-box'), (select id from public.products where slug = 'relaxed-linen-blazer'), 1, 0),
  ((select id from public.boxes where slug = 'modern-workday-box'), (select id from public.products where slug = 'fluid-wide-leg-trousers'), 1, 1),
  ((select id from public.boxes where slug = 'modern-workday-box'), (select id from public.products where slug = 'draped-neck-top'), 1, 2),
  ((select id from public.boxes where slug = 'evening-edit-box'), (select id from public.products where slug = 'column-knit-dress'), 1, 0),
  ((select id from public.boxes where slug = 'evening-edit-box'), (select id from public.products where slug = 'minimal-shoulder-bag'), 1, 1),
  ((select id from public.boxes where slug = 'evening-edit-box'), (select id from public.products where slug = 'asymmetric-satin-skirt'), 1, 2),
  ((select id from public.boxes where slug = 'weekend-light-box'), (select id from public.products where slug = 'sculpted-midi-dress'), 1, 0),
  ((select id from public.boxes where slug = 'weekend-light-box'), (select id from public.products where slug = 'minimal-shoulder-bag'), 1, 1),
  ((select id from public.boxes where slug = 'weekend-light-box'), (select id from public.products where slug = 'soft-tailored-waistcoat'), 1, 2)
on conflict (box_id, product_id) do update
set quantity = excluded.quantity, position = excluded.position;

insert into public.homepage_sections (
  id,
  section_key,
  section_type,
  eyebrow,
  heading,
  body,
  theme,
  position,
  is_visible,
  settings
)
values
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-section:hero'), 'hero', 'hero', 'New collection · Made to move', 'Ease, in motion.', 'Premium everyday pieces designed around movement, clean proportion, and quiet confidence.', 'off_white', 0, true, '{"primaryCta":{"label":"Shop New In","href":"/shop?sort=newest"},"secondaryCta":{"label":"Explore Boxes","href":"/boxes"}}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-section:shop-by-rhythm'), 'shop-by-rhythm', 'editorial', 'The ÉLAN edits · Shop by rhythm', 'A wardrobe for every movement.', 'Four considered directions for the pace, purpose, and atmosphere of your day.', 'off_white', 1, true, '{"layout":"four-card-rail"}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-section:categories'), 'categories', 'category_grid', 'Find your direction', 'A wardrobe, considered.', 'Explore by form, function, or the feeling you want to carry.', 'light', 2, true, '{"columns":3,"mobileColumns":2}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-section:curated-edits'), 'curated-edits', 'slider', 'For every moment', 'Dress with intention.', 'Glide left or right to explore considered edits for work, travel, evenings, and unhurried weekends.', 'dark', 3, true, '{"snap":"proximity","input":"native-scroll"}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-section:new-arrivals'), 'new-arrivals', 'product_grid', 'Just arrived', 'New forms', null, 'off_white', 4, true, '{"columns":4}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-section:best-sellers'), 'best-sellers', 'product_grid', 'Most considered', 'Best sellers', 'A focused selection chosen for proportion, versatility, and repeat wear.', 'light', 5, true, '{"columns":3}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-section:editorial-story'), 'editorial-story', 'editorial', 'The journal · Study 01', 'The architecture of ease.', 'Fluid tailoring and clean foundations, designed to hold their shape while leaving space for yours.', 'dark', 6, true, '{"layout":"split"}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-section:boxes'), 'boxes', 'boxes', 'Curated capsules', 'Complete the thought.', 'Each box brings together complementary pieces at a considered price.', 'light', 7, true, '{"columns":2}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-section:services'), 'services', 'services', null, null, null, 'off_white', 8, true, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-section:newsletter'), 'newsletter', 'newsletter', 'Private notes from ÉLAN', 'A considered inbox.', 'New arrivals, editorial stories, and private offers, sent with restraint.', 'dark', 9, true, '{}')
on conflict (section_key) do update
set
  section_type = excluded.section_type,
  eyebrow = excluded.eyebrow,
  heading = excluded.heading,
  body = excluded.body,
  theme = excluded.theme,
  position = excluded.position,
  is_visible = excluded.is_visible,
  settings = excluded.settings;

insert into public.homepage_section_items (
  id,
  section_id,
  product_id,
  box_id,
  placeholder_label,
  title_override,
  body_override,
  cta_label,
  cta_href,
  position,
  settings
)
values
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:hero:0'), (select id from public.homepage_sections where section_key = 'hero'), null, null, 'Full-length campaign portrait', null, null, null, null, 0, '{"alignment":"left"}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:hero:1'), (select id from public.homepage_sections where section_key = 'hero'), null, null, 'Campaign portrait in soft tailoring', null, null, null, null, 1, '{"alignment":"center"}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:hero:2'), (select id from public.homepage_sections where section_key = 'hero'), null, null, 'Campaign portrait with fluid movement', null, null, null, null, 2, '{"alignment":"right"}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:rhythm:0'), (select id from public.homepage_sections where section_key = 'shop-by-rhythm'), null, null, 'Everyday movement edit', 'The Everyday Edit', 'Fluid foundations for mornings in motion and plans that unfold slowly.', 'Shop the edit', '/shop?collection=everyday-edit', 0, '{"moment":"Everyday","note":"Fluid layers · Repeat wear"}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:rhythm:1'), (select id from public.homepage_sections where section_key = 'shop-by-rhythm'), null, null, 'Modern workwear edit', 'Soft Tailoring', 'Relaxed tailoring that remains composed without ever feeling rigid.', 'Shop tailoring', '/shop?category=tailoring', 1, '{"moment":"In focus","note":"Clean lines · Soft structure"}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:rhythm:2'), (select id from public.homepage_sections where section_key = 'shop-by-rhythm'), null, null, 'Evening movement edit', 'After Dark', 'Clean silhouettes, fluid lines, and subtle expression for evenings ahead.', 'Shop evening', '/shop?collection=after-dark', 2, '{"moment":"After hours","note":"Fluid forms · Quiet impact"}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:rhythm:3'), (select id from public.homepage_sections where section_key = 'shop-by-rhythm'), null, null, 'Curated capsule box', 'The Capsule Edit', 'Considered capsules assembled to make getting dressed feel effortless.', 'Discover boxes', '/boxes', 3, '{"moment":"Curated together","note":"Complete looks · Considered value"}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:category:dresses'), (select id from public.homepage_sections where section_key = 'categories'), null, null, 'Dresses editorial', 'Dresses', 'Clean lines for everyday and evening.', 'Shop dresses', '/shop?category=dresses', 0, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:category:tailoring'), (select id from public.homepage_sections where section_key = 'categories'), null, null, 'Tailoring editorial', 'Tailoring', 'Modern structure with an easy point of view.', 'Shop tailoring', '/shop?category=tailoring', 1, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:category:tops'), (select id from public.homepage_sections where section_key = 'categories'), null, null, 'Tops editorial', 'Tops', 'Refined foundations for a considered wardrobe.', 'Shop tops', '/shop?category=tops', 2, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:category:bottoms'), (select id from public.homepage_sections where section_key = 'categories'), null, null, 'Bottoms editorial', 'Bottoms', 'Fluid trousers and versatile skirts.', 'Shop bottoms', '/shop?category=bottoms', 3, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:category:sets'), (select id from public.homepage_sections where section_key = 'categories'), null, null, 'Sets editorial', 'Sets', 'Coordinated pieces, styled together or apart.', 'Shop sets', '/shop?category=sets', 4, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:category:accessories'), (select id from public.homepage_sections where section_key = 'categories'), null, null, 'Accessories editorial', 'Accessories', 'The final, intentional detail.', 'Shop accessories', '/shop?category=accessories', 5, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:edit:weekend'), (select id from public.homepage_sections where section_key = 'curated-edits'), null, null, 'Relaxed weekend styling', 'Weekend Edit', 'Soft layers and easy proportions for unhurried days.', 'Explore edit', '/boxes/weekend-light-box', 0, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:edit:office'), (select id from public.homepage_sections where section_key = 'curated-edits'), null, null, 'Modern office tailoring', 'Office Edit', 'Tailoring that holds its line without feeling rigid.', 'Explore edit', '/boxes/modern-workday-box', 1, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:edit:evening'), (select id from public.homepage_sections where section_key = 'curated-edits'), null, null, 'Evening silhouettes', 'Evening Edit', 'Quietly expressive silhouettes for after dark.', 'Explore edit', '/boxes/evening-edit-box', 2, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:edit:tailoring'), (select id from public.homepage_sections where section_key = 'curated-edits'), null, null, 'Soft tailoring details', 'Soft Tailoring', 'Structure reconsidered through fluid cloth and ease.', 'Explore edit', '/shop?category=tailoring', 3, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:edit:travel'), (select id from public.homepage_sections where section_key = 'curated-edits'), null, null, 'Travel capsule wardrobe', 'Travel Capsule', 'A compact wardrobe designed to move beautifully.', 'Explore edit', '/shop?collection=everyday-edit', 4, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:new:0'), (select id from public.homepage_sections where section_key = 'new-arrivals'), (select id from public.products where slug = 'sculpted-midi-dress'), null, null, null, null, null, null, 0, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:new:1'), (select id from public.homepage_sections where section_key = 'new-arrivals'), (select id from public.products where slug = 'relaxed-linen-blazer'), null, null, null, null, null, null, 1, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:new:2'), (select id from public.homepage_sections where section_key = 'new-arrivals'), (select id from public.products where slug = 'fluid-wide-leg-trousers'), null, null, null, null, null, null, 2, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:new:3'), (select id from public.homepage_sections where section_key = 'new-arrivals'), (select id from public.products where slug = 'draped-neck-top'), null, null, null, null, null, null, 3, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:best:0'), (select id from public.homepage_sections where section_key = 'best-sellers'), (select id from public.products where slug = 'relaxed-linen-blazer'), null, null, null, null, null, null, 0, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:best:1'), (select id from public.homepage_sections where section_key = 'best-sellers'), (select id from public.products where slug = 'fluid-wide-leg-trousers'), null, null, null, null, null, null, 1, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:best:2'), (select id from public.homepage_sections where section_key = 'best-sellers'), (select id from public.products where slug = 'column-knit-dress'), null, null, null, null, null, null, 2, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:story:0'), (select id from public.homepage_sections where section_key = 'editorial-story'), null, null, 'Architectural tailoring in motion', null, null, 'Shop the edit', '/shop?collection=new-form', 0, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:box:0'), (select id from public.homepage_sections where section_key = 'boxes'), null, (select id from public.boxes where slug = 'modern-workday-box'), null, null, null, null, null, 0, '{}'),
  (extensions.uuid_generate_v5('3edb99f0-224a-4d81-9af8-2a1ae9b04101', 'homepage-item:box:1'), (select id from public.homepage_sections where section_key = 'boxes'), null, (select id from public.boxes where slug = 'evening-edit-box'), null, null, null, null, null, 1, '{}')
on conflict (section_id, position) do update
set
  product_id = excluded.product_id,
  box_id = excluded.box_id,
  placeholder_label = excluded.placeholder_label,
  title_override = excluded.title_override,
  body_override = excluded.body_override,
  cta_label = excluded.cta_label,
  cta_href = excluded.cta_href,
  is_visible = true,
  settings = excluded.settings;

commit;
