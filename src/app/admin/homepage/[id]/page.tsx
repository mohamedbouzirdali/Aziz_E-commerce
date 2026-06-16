import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { moveHomepageItemAction } from "@/app/admin/homepage/actions";
import { HomepageItemForm } from "@/components/admin/homepage-item-form";
import { Button } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth/session";
import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Homepage Section" };

const notices: Record<string, string> = {
  "item-created": "Homepage item created.",
  "item-saved": "Homepage item saved.",
  "item-moved": "Homepage item order updated.",
  "item-deleted": "Homepage item deleted.",
  "item-validation-failed":
    "Choose a valid target and provide a label for placeholders.",
  "item-save-failed": "The homepage item could not be saved.",
  "item-move-failed": "The homepage item could not be moved.",
  "item-delete-failed": "The homepage item could not be deleted.",
};

function placementLabel(sectionKey: string, index: number) {
  const labels: Record<string, string[]> = {
    hero: ["Primary banner", "Supporting image 01", "Supporting image 02"],
    "shop-by-rhythm": [
      "Editorial card 01",
      "Editorial card 02",
      "Editorial card 03",
      "Editorial card 04",
    ],
    categories: [
      "Featured category 01",
      "Featured category 02",
      "Featured category 03",
      "Additional category 01",
      "Additional category 02",
      "Additional category 03",
    ],
    "curated-edits": [
      "Slider card 01",
      "Slider card 02",
      "Slider card 03",
      "Slider card 04",
      "Slider card 05",
    ],
    "new-arrivals": [
      "Selected product 01",
      "Selected product 02",
      "Selected product 03",
      "Selected product 04",
      "Selected product 05",
    ],
    "best-sellers": ["Story image 01", "Story image 02", "Story image 03"],
    "editorial-story": ["Feature story image"],
    boxes: ["Featured box 01", "Featured box 02"],
  };

  return labels[sectionKey]?.[index] || `Placement ${String(index + 1).padStart(2, "0")}`;
}

function targetSummary(item: Tables<"homepage_section_items">) {
  if (item.product_id) return "Product";
  if (item.box_id) return "Box";
  if (item.media_asset_id) return "Media";
  return "Placeholder";
}

export default async function HomepageSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const [
    { data: section },
    { data: items },
    { data: products },
    { data: boxes },
    { data: media },
  ] = await Promise.all([
    supabase.from("homepage_sections").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("homepage_section_items")
      .select("*")
      .eq("section_id", id)
      .order("position"),
    supabase
      .from("products")
      .select("id, name, status")
      .neq("status", "archived")
      .order("name"),
    supabase
      .from("boxes")
      .select("id, name, status")
      .neq("status", "archived")
      .order("name"),
    supabase
      .from("media_assets")
      .select("id, alt_text, object_path")
      .order("created_at", { ascending: false }),
  ]);

  if (!section) {
    notFound();
  }

  return (
    <div>
      <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">
            Homepage · {section.section_type.replace("_", " ")}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
            {section.heading || section.section_key}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
            Select canonical products, boxes, media, or editorial placeholders.
            Overrides apply only to this placement.
          </p>
        </div>
        <Button href="/admin/homepage" variant="secondary">
          All sections
        </Button>
      </header>

      {query.notice && notices[query.notice] && (
        <p className="mt-6 border border-black/15 bg-white px-4 py-3 text-xs">
          {notices[query.notice]}
        </p>
      )}

      <section className="mt-8 border border-border bg-white p-5 sm:p-7">
        <p className="eyebrow">Add placement</p>
        <div className="mt-6">
          <HomepageItemForm
            sectionId={section.id}
            products={products ?? []}
            boxes={boxes ?? []}
            media={media ?? []}
            placementLabel={`New ${placementLabel(section.section_key, items?.length ?? 0)}`}
          />
        </div>
      </section>

      <section className="mt-8 space-y-4">
        {(items ?? []).map((item, index) => (
          <article key={item.id} className="border border-border bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-off-white px-5 py-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-charcoal">
                  {placementLabel(section.section_key, index)}
                </p>
                <p className="mt-1 text-sm">
                  {item.title_override ||
                    item.placeholder_label ||
                    "Canonical record"}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-charcoal/55">
                  {targetSummary(item)}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={moveHomepageItemAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="sectionId" value={section.id} />
                  <input type="hidden" name="direction" value="-1" />
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={index === 0}
                    aria-label={`Move placement ${index + 1} up`}
                  >
                    Up
                  </Button>
                </form>
                <form action={moveHomepageItemAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="sectionId" value={section.id} />
                  <input type="hidden" name="direction" value="1" />
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={index === (items?.length ?? 0) - 1}
                    aria-label={`Move placement ${index + 1} down`}
                  >
                    Down
                  </Button>
                </form>
              </div>
            </div>
            <div className="p-5 sm:p-7">
              <HomepageItemForm
                sectionId={section.id}
                item={item}
                products={products ?? []}
                boxes={boxes ?? []}
                media={media ?? []}
                placementLabel={placementLabel(section.section_key, index)}
              />
            </div>
          </article>
        ))}

        {!items?.length && (
          <div className="border border-border bg-white p-10 text-center">
            <p className="font-serif text-3xl">No placements yet</p>
            <p className="mt-3 text-xs text-charcoal">
              Add the first item above.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
