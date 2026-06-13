begin;

create function public.has_role(requested_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = requested_role
  );
$$;

create function public.can_manage_content()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.has_role('editor') or public.has_role('admin');
$$;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.has_role('admin');
$$;

create function public.is_published_product(requested_product_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.products
    where id = requested_product_id
      and status = 'active'
      and published_at <= timezone('utc', now())
  );
$$;

create function public.is_published_box(requested_box_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.boxes
    where id = requested_box_id
      and status = 'active'
      and published_at <= timezone('utc', now())
  );
$$;

revoke all on function public.has_role(public.app_role) from public;
revoke all on function public.can_manage_content() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.is_published_product(uuid) from public;
revoke all on function public.is_published_box(uuid) from public;

grant execute on function public.has_role(public.app_role) to authenticated;
grant execute on function public.can_manage_content() to anon, authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_published_product(uuid) to anon, authenticated;
grant execute on function public.is_published_box(uuid) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_collections enable row level security;
alter table public.option_types enable row level security;
alter table public.option_values enable row level security;
alter table public.product_option_values enable row level security;
alter table public.product_variants enable row level security;
alter table public.variant_option_values enable row level security;
alter table public.media_assets enable row level security;
alter table public.product_media enable row level security;
alter table public.inventory_locations enable row level security;
alter table public.inventory_levels enable row level security;
alter table public.inventory_adjustments enable row level security;
alter table public.boxes enable row level security;
alter table public.box_items enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.homepage_section_items enable row level security;
alter table public.admin_audit_logs enable row level security;

create policy "Profiles are visible to their owner"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy "Profiles can be updated by their owner"
on public.profiles for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "Users can read their roles"
on public.user_roles for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "Admins manage roles"
on public.user_roles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Active categories are public"
on public.categories for select
to anon, authenticated
using (is_active or public.can_manage_content());

create policy "Content managers manage categories"
on public.categories for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Active collections are public"
on public.collections for select
to anon, authenticated
using (is_active or public.can_manage_content());

create policy "Content managers manage collections"
on public.collections for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Published products are public"
on public.products for select
to anon, authenticated
using (
  (
    status = 'active'
    and published_at <= timezone('utc', now())
  )
  or public.can_manage_content()
);

create policy "Content managers manage products"
on public.products for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Published product collections are public"
on public.product_collections for select
to anon, authenticated
using (
  public.is_published_product(product_id)
  or public.can_manage_content()
);

create policy "Content managers manage product collections"
on public.product_collections for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Used option types are public"
on public.option_types for select
to anon, authenticated
using (
  exists (
    select 1
    from public.option_values
    join public.product_option_values
      on product_option_values.option_value_id = option_values.id
    where option_values.option_type_id = option_types.id
      and public.is_published_product(product_option_values.product_id)
  )
  or public.can_manage_content()
);

create policy "Content managers manage option types"
on public.option_types for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Used option values are public"
on public.option_values for select
to anon, authenticated
using (
  exists (
    select 1
    from public.product_option_values
    where product_option_values.option_value_id = option_values.id
      and public.is_published_product(product_option_values.product_id)
  )
  or public.can_manage_content()
);

create policy "Content managers manage option values"
on public.option_values for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Published product option links are public"
on public.product_option_values for select
to anon, authenticated
using (
  public.is_published_product(product_id)
  or public.can_manage_content()
);

create policy "Content managers manage product option links"
on public.product_option_values for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Active published variants are public"
on public.product_variants for select
to anon, authenticated
using (
  (
    is_active
    and public.is_published_product(product_id)
  )
  or public.can_manage_content()
);

create policy "Content managers manage variants"
on public.product_variants for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Published variant option links are public"
on public.variant_option_values for select
to anon, authenticated
using (
  exists (
    select 1
    from public.product_variants
    where product_variants.id = variant_option_values.variant_id
      and product_variants.is_active
      and public.is_published_product(product_variants.product_id)
  )
  or public.can_manage_content()
);

create policy "Content managers manage variant option links"
on public.variant_option_values for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Published media metadata is public"
on public.media_assets for select
to anon, authenticated
using (
  exists (
    select 1
    from public.product_media
    where product_media.media_asset_id = media_assets.id
      and public.is_published_product(product_media.product_id)
  )
  or exists (
    select 1
    from public.homepage_section_items
    join public.homepage_sections
      on homepage_sections.id = homepage_section_items.section_id
    where homepage_section_items.media_asset_id = media_assets.id
      and homepage_section_items.is_visible
      and homepage_sections.is_visible
  )
  or public.can_manage_content()
);

create policy "Content managers manage media metadata"
on public.media_assets for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Published product media is public"
on public.product_media for select
to anon, authenticated
using (
  public.is_published_product(product_id)
  or public.can_manage_content()
);

create policy "Content managers manage product media"
on public.product_media for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Content managers read inventory locations"
on public.inventory_locations for select
to authenticated
using (public.can_manage_content());

create policy "Admins manage inventory locations"
on public.inventory_locations for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Content managers read inventory levels"
on public.inventory_levels for select
to authenticated
using (public.can_manage_content());

create policy "Admins manage inventory levels"
on public.inventory_levels for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins read inventory adjustments"
on public.inventory_adjustments for select
to authenticated
using (public.is_admin());

create policy "Admins create inventory adjustments"
on public.inventory_adjustments for insert
to authenticated
with check (public.is_admin());

create policy "Published boxes are public"
on public.boxes for select
to anon, authenticated
using (
  (
    status = 'active'
    and published_at <= timezone('utc', now())
  )
  or public.can_manage_content()
);

create policy "Content managers manage boxes"
on public.boxes for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Published box items are public"
on public.box_items for select
to anon, authenticated
using (
  (
    public.is_published_box(box_id)
    and public.is_published_product(product_id)
  )
  or public.can_manage_content()
);

create policy "Content managers manage box items"
on public.box_items for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Visible homepage sections are public"
on public.homepage_sections for select
to anon, authenticated
using (is_visible or public.can_manage_content());

create policy "Content managers manage homepage sections"
on public.homepage_sections for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Visible homepage items are public"
on public.homepage_section_items for select
to anon, authenticated
using (
  (
    is_visible
    and exists (
      select 1
      from public.homepage_sections
      where homepage_sections.id = homepage_section_items.section_id
        and homepage_sections.is_visible
    )
    and (
      product_id is null
      or public.is_published_product(product_id)
    )
    and (
      box_id is null
      or public.is_published_box(box_id)
    )
  )
  or public.can_manage_content()
);

create policy "Content managers manage homepage items"
on public.homepage_section_items for all
to authenticated
using (public.can_manage_content())
with check (public.can_manage_content());

create policy "Admins read audit logs"
on public.admin_audit_logs for select
to authenticated
using (public.is_admin());

grant usage on schema public to anon, authenticated;

grant select on
  public.categories,
  public.collections,
  public.products,
  public.product_collections,
  public.option_types,
  public.option_values,
  public.product_option_values,
  public.product_variants,
  public.variant_option_values,
  public.media_assets,
  public.product_media,
  public.boxes,
  public.box_items,
  public.homepage_sections,
  public.homepage_section_items
to anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select on public.user_roles to authenticated;

grant insert, update, delete on
  public.categories,
  public.collections,
  public.products,
  public.product_collections,
  public.option_types,
  public.option_values,
  public.product_option_values,
  public.product_variants,
  public.variant_option_values,
  public.media_assets,
  public.product_media,
  public.boxes,
  public.box_items,
  public.homepage_sections,
  public.homepage_section_items
to authenticated;

grant select, insert, update, delete on
  public.inventory_locations,
  public.inventory_levels
to authenticated;

grant select, insert on public.inventory_adjustments to authenticated;
grant select, insert, update, delete on public.user_roles to authenticated;
grant select on public.admin_audit_logs to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'catalog-media',
  'catalog-media',
  true,
  10485760,
  array['image/avif', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Catalog media is publicly readable"
on storage.objects for select
to public
using (bucket_id = 'catalog-media');

create policy "Content managers upload catalog media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'catalog-media'
  and public.can_manage_content()
);

create policy "Content managers update catalog media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'catalog-media'
  and public.can_manage_content()
)
with check (
  bucket_id = 'catalog-media'
  and public.can_manage_content()
);

create policy "Content managers delete catalog media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'catalog-media'
  and public.can_manage_content()
);

commit;
