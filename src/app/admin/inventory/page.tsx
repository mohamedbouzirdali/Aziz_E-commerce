import type { Metadata } from "next";
import { adjustInventoryAction } from "@/app/admin/inventory/actions";
import { Button } from "@/components/ui/button";
import { getAuthContext, requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Inventory" };

const notices: Record<string, string> = {
  updated: "Inventory updated and its adjustment history recorded.",
  "validation-failed": "Enter valid whole-number stock values.",
  "below-reserved": "Stock cannot be lower than the reserved quantity.",
  "update-failed": "Inventory could not be updated.",
};

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireStaff();
  const auth = await getAuthContext();
  const params = await searchParams;
  const supabase = await createClient();
  const [
    { data: levels, error },
    { data: variants },
    { data: products },
  ] = await Promise.all([
    supabase
      .from("inventory_levels")
      .select(
        "id, variant_id, stocked_quantity, reserved_quantity, low_stock_threshold, updated_at",
      )
      .order("updated_at", { ascending: false }),
    supabase
      .from("product_variants")
      .select("id, product_id, sku, title, is_active"),
    supabase.from("products").select("id, name, slug"),
  ]);
  const variantsById = new Map(
    (variants ?? []).map((variant) => [variant.id, variant]),
  );
  const productsById = new Map(
    (products ?? []).map((product) => [product.id, product]),
  );
  const canAdjust = Boolean(auth?.roles.includes("admin"));

  return (
    <div>
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Stock control</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
          Inventory
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
          Exact quantities remain private. Every stock correction is validated
          against reservations and written to adjustment history.
        </p>
      </header>

      {params.notice && notices[params.notice] && (
        <p className="mt-6 border border-black/15 bg-white px-4 py-3 text-xs">
          {notices[params.notice]}
        </p>
      )}

      {!canAdjust && (
        <p className="mt-6 border border-black/15 bg-white px-4 py-3 text-xs leading-5 text-charcoal">
          Editors can review inventory. Only administrators can change stock.
        </p>
      )}

      {error ? (
        <p className="mt-8 border border-red-900/20 bg-red-50 p-5 text-sm text-red-900">
          Inventory is unavailable until the hosted migration is applied.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {(levels ?? []).map((level) => {
            const variant = variantsById.get(level.variant_id);
            const product = variant
              ? productsById.get(variant.product_id)
              : undefined;
            const available =
              level.stocked_quantity - level.reserved_quantity;
            const isLow = available <= level.low_stock_threshold;

            return (
              <article
                key={level.id}
                className="border border-border bg-white p-5"
              >
                <div className="grid gap-5 lg:grid-cols-[minmax(220px,1fr)_auto] lg:items-end">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-serif text-2xl">
                        {product?.name ?? "Unknown product"}
                      </p>
                      <span
                        className={`border px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] ${
                          isLow
                            ? "border-red-900/30 bg-red-50 text-red-900"
                            : "border-black/15"
                        }`}
                      >
                        {isLow ? "Low stock" : "In stock"}
                      </span>
                      {variant && !variant.is_active && (
                        <span className="border border-black/15 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-charcoal">
                          Inactive variant
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-charcoal">
                      {variant?.title ?? level.variant_id}
                    </p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-charcoal/55">
                      {variant?.sku ?? "No SKU"} · Available {available} ·
                      Reserved {level.reserved_quantity}
                    </p>
                  </div>

                  {canAdjust ? (
                    <form
                      action={adjustInventoryAction}
                      className="grid gap-3 sm:grid-cols-[110px_110px_minmax(180px,1fr)_auto]"
                    >
                      <input
                        type="hidden"
                        name="inventoryLevelId"
                        value={level.id}
                      />
                      <label className="text-[9px] font-semibold uppercase tracking-[0.12em]">
                        Stocked
                        <input
                          name="stockedQuantity"
                          type="number"
                          min={level.reserved_quantity}
                          step="1"
                          defaultValue={level.stocked_quantity}
                          required
                          className="mt-2 min-h-11 w-full border border-border px-3 text-sm"
                        />
                      </label>
                      <label className="text-[9px] font-semibold uppercase tracking-[0.12em]">
                        Low at
                        <input
                          name="lowStockThreshold"
                          type="number"
                          min="0"
                          step="1"
                          defaultValue={level.low_stock_threshold}
                          required
                          className="mt-2 min-h-11 w-full border border-border px-3 text-sm"
                        />
                      </label>
                      <label className="text-[9px] font-semibold uppercase tracking-[0.12em]">
                        Adjustment note
                        <input
                          name="note"
                          placeholder="Reason for this correction"
                          className="mt-2 min-h-11 w-full border border-border px-3 text-sm normal-case tracking-normal"
                        />
                      </label>
                      <Button type="submit" variant="secondary">
                        Update
                      </Button>
                    </form>
                  ) : (
                    <div className="grid grid-cols-3 gap-px bg-border text-center">
                      {[
                        ["Stocked", level.stocked_quantity],
                        ["Reserved", level.reserved_quantity],
                        ["Available", available],
                      ].map(([label, count]) => (
                        <div key={label} className="bg-off-white px-4 py-3">
                          <p className="text-[8px] uppercase tracking-[0.12em] text-charcoal">
                            {label}
                          </p>
                          <p className="mt-1 font-serif text-2xl">{count}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}

          {!levels?.length && (
            <div className="border border-border bg-white p-10 text-center">
              <p className="font-serif text-3xl">No inventory levels yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
