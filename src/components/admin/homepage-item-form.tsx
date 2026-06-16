import {
  deleteHomepageItemAction,
  saveHomepageItemAction,
} from "@/app/admin/homepage/actions";
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
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black">
            {placementLabel || "Homepage placement"}
          </p>
          <p className="mt-2">
            Use <strong>Media</strong> for image-led homepage sections. Use
            <strong> Products</strong> or <strong>Boxes</strong> only where the
            placement should link directly to merchandise.
          </p>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor={`${item?.id ?? "new"}-target`}>
          Content target
        </label>
        <select
          id={`${item?.id ?? "new"}-target`}
          name="target"
          defaultValue={currentTarget(item)}
          className={inputClass}
        >
          <option value="placeholder">Editorial placeholder</option>
          <optgroup label="Products">
            {products.map((product) => (
              <option key={product.id} value={`product:${product.id}`}>
                {product.name} · {product.status}
              </option>
            ))}
          </optgroup>
          <optgroup label="Boxes">
            {boxes.map((box) => (
              <option key={box.id} value={`box:${box.id}`}>
                {box.name} · {box.status}
              </option>
            ))}
          </optgroup>
          <optgroup label="Media">
            {media.map((asset) => (
              <option key={asset.id} value={`media:${asset.id}`}>
                {asset.alt_text} · {asset.object_path}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <div>
        <label
          className={labelClass}
          htmlFor={`${item?.id ?? "new"}-placeholder`}
        >
          Image label / fallback
        </label>
        <input
          id={`${item?.id ?? "new"}-placeholder`}
          name="placeholderLabel"
          defaultValue={item?.placeholder_label ?? ""}
          className={inputClass}
          placeholder="Campaign portrait in soft tailoring"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor={`${item?.id ?? "new"}-title`}>
          Title override
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
          CTA label
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
          Supporting copy
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
          CTA path
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
              loadingLabel="Deleting item..."
            >
              Delete
            </Button>
          )}
          <Button type="submit" loadingLabel={item ? "Saving item..." : "Adding item..."}>
            {item ? "Save item" : "Add item"}
          </Button>
        </div>
      </div>
    </form>
  );
}
