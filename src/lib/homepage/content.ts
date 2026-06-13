import "server-only";

import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type HomepageMedia = {
  url: string;
  altText: string;
};

export type HomepageContentItem = Tables<"homepage_section_items"> & {
  productSlug: string | null;
  productName: string | null;
  boxSlug: string | null;
  boxName: string | null;
  media: HomepageMedia | null;
};

export type HomepageContentSection = Tables<"homepage_sections"> & {
  items: HomepageContentItem[];
};

export async function getHomepageContent(): Promise<
  HomepageContentSection[] | null
> {
  try {
    const supabase = await createClient();
    const [
      sectionsResult,
      itemsResult,
      productsResult,
      boxesResult,
      mediaResult,
    ] = await Promise.all([
      supabase
        .from("homepage_sections")
        .select("*")
        .eq("is_visible", true)
        .order("position"),
      supabase
        .from("homepage_section_items")
        .select("*")
        .eq("is_visible", true)
        .order("position"),
      supabase.from("products").select("id, slug, name"),
      supabase.from("boxes").select("id, slug, name"),
      supabase
        .from("media_assets")
        .select("id, bucket, object_path, alt_text"),
    ]);

    if (
      sectionsResult.error ||
      itemsResult.error ||
      productsResult.error ||
      boxesResult.error ||
      mediaResult.error
    ) {
      return null;
    }

    const productById = new Map(
      (productsResult.data ?? []).map((product) => [product.id, product]),
    );
    const boxById = new Map(
      (boxesResult.data ?? []).map((box) => [box.id, box]),
    );
    const mediaById = new Map(
      (mediaResult.data ?? []).map((asset) => [
        asset.id,
        {
          url: supabase.storage
            .from(asset.bucket)
            .getPublicUrl(asset.object_path).data.publicUrl,
          altText: asset.alt_text,
        },
      ]),
    );
    const itemsBySection = new Map<string, HomepageContentItem[]>();

    for (const item of itemsResult.data ?? []) {
      const product = item.product_id
        ? productById.get(item.product_id)
        : undefined;
      const box = item.box_id ? boxById.get(item.box_id) : undefined;
      const sectionItems = itemsBySection.get(item.section_id) ?? [];

      sectionItems.push({
        ...item,
        productSlug: product?.slug ?? null,
        productName: product?.name ?? null,
        boxSlug: box?.slug ?? null,
        boxName: box?.name ?? null,
        media: item.media_asset_id
          ? (mediaById.get(item.media_asset_id) ?? null)
          : null,
      });
      itemsBySection.set(item.section_id, sectionItems);
    }

    return (sectionsResult.data ?? []).map((section) => ({
      ...section,
      items: itemsBySection.get(section.id) ?? [],
    }));
  } catch {
    return null;
  }
}
