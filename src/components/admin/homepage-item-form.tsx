import {
  deleteHomepageItemAction,
  saveHomepageItemAction,
} from "@/app/admin/homepage/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/lib/supabase/database.types";

type ProductChoice = Pick<Tables<"products">, "id" | "name" | "status">;
type BoxChoice = Pick<Tables<"boxes">, "id" | "name" | "status">;
type MediaChoice = Pick<
  Tables<"media_assets">,
  "id" | "alt_text" | "object_path"
>;

const inputClass =
  "mt-2 min-h-11 w-full border border-border bg-white px-3 text-sm outline-none transition-colors focus:border-black";
const labelClass =
  "text-[9px] font-semibold uppercase tracking-[0.14em] text-charcoal";

function currentTarget(item?: Tables<"homepage_section_items">) {
  if (!item) return "placeholder";
  if (item.product_id) return `product:${item.product_id}`;
  if (item.box_id) return `box:${item.box_id}`;
  if (item.media_asset_id) return `media:${item.media_asset_id}`;
  return "placeholder";
}

export function HomepageItemForm({
  sectionId,
  item,
  products,
  boxes,
  media,
  placementLabel,
}: {
  sectionId: string;
  item?: Tables<"homepage_section_items">;
  products: ProductChoice[];
  boxes: BoxChoice[];
  media: MediaChoice[];
  placementLabel?: string;
}) {
  return (
    <form
      action={saveHomepageItemAction}
      className="grid gap-5 lg:grid-cols-2"
    >
      <input type="hidden" name="sectionId" value={sectionId} />
      {item && <input type="hidden" name="id" value={item.id} />}

      <div className="lg:col-span-2">
        <div className="border border-border bg-off-white px-4 py-4 text-xs leading-6 text-charcoal">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black">
                {placementLabel || "Emplacement accueil"}
              </p>
              <p className="mt-2">
                Choisissez <strong>Image</strong> quand l’emplacement sert
                surtout de visuel. Choisissez <strong>Produit</strong> ou
                <strong> Coffret</strong> quand le contenu doit reprendre les
                informations catalogue.
              </p>
            </div>
            <Link
              href="/admin/media"
              className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.14em] text-black underline underline-offset-4"
            >
              Importer une image
            </Link>
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor={`${item?.id ?? "new"}-target`}>
          Contenu affiché
        </label>
        <select
          id={`${item?.id ?? "new"}-target`}
          name="target"
          defaultValue={currentTarget(item)}
          className={inputClass}
        >
          <option value="placeholder">Placeholder éditorial</option>
          <optgroup label="Produits">
            {products.map((product) => (
              <option key={product.id} value={`product:${product.id}`}>
                {product.name} · {product.status}
              </option>
            ))}
          </optgroup>
          <optgroup label="Coffrets">
            {boxes.map((box) => (
              <option key={box.id} value={`box:${box.id}`}>
                {box.name} · {box.status}
              </option>
            ))}
          </optgroup>
          <optgroup label="Images">
            {media.map((asset) => (
              <option key={asset.id} value={`media:${asset.id}`}>
                {asset.alt_text} · {asset.object_path}
              </option>
            ))}
          </optgroup>
        </select>
        <p className="mt-2 text-[11px] leading-5 text-charcoal/70">
          Les nouvelles photos apparaissent ici après import dans la bibliothèque.
        </p>
      </div>

      <div>
        <label
          className={labelClass}
          htmlFor={`${item?.id ?? "new"}-placeholder`}
        >
          Libellé image / fallback
        </label>
        <input
          id={`${item?.id ?? "new"}-placeholder`}
          name="placeholderLabel"
          defaultValue={item?.placeholder_label ?? ""}
          className={inputClass}
          placeholder="Portrait campagne en activewear"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor={`${item?.id ?? "new"}-title`}>
          Titre personnalisé
        </label>
        <input
          id={`${item?.id ?? "new"}-title`}
          name="titleOverride"
          defaultValue={item?.title_override ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor={`${item?.id ?? "new"}-cta-label`}>
          Libellé CTA
        </label>
        <input
          id={`${item?.id ?? "new"}-cta-label`}
          name="ctaLabel"
          defaultValue={item?.cta_label ?? ""}
          className={inputClass}
        />
      </div>

      <div className="lg:col-span-2">
        <label className={labelClass} htmlFor={`${item?.id ?? "new"}-body`}>
          Texte
        </label>
        <textarea
          id={`${item?.id ?? "new"}-body`}
          name="bodyOverride"
          defaultValue={item?.body_override ?? ""}
          className="mt-2 min-h-24 w-full border border-border bg-white px-3 py-3 text-sm leading-6 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor={`${item?.id ?? "new"}-cta-href`}>
          Lien CTA
        </label>
        <input
          id={`${item?.id ?? "new"}-cta-href`}
          name="ctaHref"
          defaultValue={item?.cta_href ?? ""}
          className={inputClass}
          placeholder="/shop?collection=new-form"
        />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <label className="flex min-h-11 items-center gap-2 text-xs">
          <input
            type="checkbox"
            name="isVisible"
            defaultChecked={item?.is_visible ?? true}
            className="size-4 accent-black"
          />
          Visible
        </label>
        <div className="flex flex-wrap gap-3">
          {item && (
            <Button
              type="submit"
              formAction={deleteHomepageItemAction}
              variant="secondary"
              loadingLabel="Suppression..."
            >
              Supprimer
            </Button>
          )}
          <Button type="submit" loadingLabel={item ? "Enregistrement..." : "Ajout..."}>
            {item ? "Enregistrer" : "Ajouter"}
          </Button>
        </div>
      </div>
    </form>
  );
}
