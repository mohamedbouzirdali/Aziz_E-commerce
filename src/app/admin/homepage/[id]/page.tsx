import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { moveHomepageItemAction } from "@/app/admin/homepage/actions";
import { HomepageItemForm } from "@/components/admin/homepage-item-form";
import { Button } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth/session";
import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Section d’accueil" };

const notices: Record<string, string> = {
  "item-created": "Élément ajouté.",
  "item-saved": "Élément enregistré.",
  "item-moved": "Ordre mis à jour.",
  "item-deleted": "Élément supprimé.",
  "item-validation-failed":
    "Choisissez une cible valide et ajoutez un libellé pour les placeholders.",
  "item-save-failed": "L’élément n’a pas pu être enregistré.",
  "item-move-failed": "L’élément n’a pas pu être déplacé.",
  "item-delete-failed": "L’élément n’a pas pu être supprimé.",
};

function placementLabel(sectionKey: string, index: number) {
  const labels: Record<string, string[]> = {
    hero: ["Bannière principale", "Image secondaire 01", "Image secondaire 02"],
    "shop-by-rhythm": [
      "Carte éditoriale 01",
      "Carte éditoriale 02",
      "Carte éditoriale 03",
      "Carte éditoriale 04",
    ],
    categories: [
      "Catégorie mise en avant 01",
      "Catégorie mise en avant 02",
      "Catégorie mise en avant 03",
      "Catégorie additionnelle 01",
      "Catégorie additionnelle 02",
      "Catégorie additionnelle 03",
    ],
    "curated-edits": [
      "Carte slider 01",
      "Carte slider 02",
      "Carte slider 03",
      "Carte slider 04",
      "Carte slider 05",
    ],
    "new-arrivals": [
      "Produit sélectionné 01",
      "Produit sélectionné 02",
      "Produit sélectionné 03",
      "Produit sélectionné 04",
      "Produit sélectionné 05",
    ],
    "best-sellers": ["Image histoire 01", "Image histoire 02", "Image histoire 03"],
    "editorial-story": ["Image éditoriale"],
    boxes: ["Coffret mis en avant 01", "Coffret mis en avant 02"],
  };

  return labels[sectionKey]?.[index] || `Emplacement ${String(index + 1).padStart(2, "0")}`;
}

function targetSummary(item: Tables<"homepage_section_items">) {
  if (item.product_id) return "Produit";
  if (item.box_id) return "Coffret";
  if (item.media_asset_id) return "Image";
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
            Accueil · {section.section_type.replace("_", " ")}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
            {section.heading || section.section_key}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
            Choisissez un produit, un coffret, une image ou un placeholder
            éditorial. Les modifications s’appliquent uniquement ici.
          </p>
        </div>
        <Button href="/admin/homepage" variant="secondary">
          Toutes les sections
        </Button>
      </header>

      {query.notice && notices[query.notice] && (
        <p className="mt-6 border border-black/15 bg-white px-4 py-3 text-xs">
          {notices[query.notice]}
        </p>
      )}

      <section className="mt-8 border border-border bg-white p-5 sm:p-7">
        <p className="eyebrow">Ajouter un emplacement</p>
        <div className="mt-6">
          <HomepageItemForm
            sectionId={section.id}
            products={products ?? []}
            boxes={boxes ?? []}
            media={media ?? []}
            placementLabel={`Nouveau · ${placementLabel(section.section_key, items?.length ?? 0)}`}
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
                    "Contenu lié"}
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
                    aria-label={`Monter l’emplacement ${index + 1}`}
                  >
                    Monter
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
                    aria-label={`Descendre l’emplacement ${index + 1}`}
                  >
                    Descendre
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
            <p className="font-serif text-3xl">Aucun emplacement</p>
            <p className="mt-3 text-xs text-charcoal">
              Ajoutez le premier élément ci-dessus.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
