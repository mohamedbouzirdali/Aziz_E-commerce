"use client";

import { useActionState } from "react";
import { saveBoxAction } from "@/app/admin/boxes/actions";
import { Button } from "@/components/ui/button";
import {
  initialAdminActionState,
  type AdminActionState,
} from "@/lib/admin/forms";
import type { Tables } from "@/lib/supabase/database.types";

type ProductChoice = Pick<
  Tables<"products">,
  "id" | "name" | "base_price_tnd" | "status"
>;

const inputClass =
  "mt-2 min-h-12 w-full border border-border bg-white px-4 text-sm outline-none transition-colors focus:border-black";
const labelClass =
  "text-[10px] font-semibold uppercase tracking-[0.16em]";

function ErrorText({
  state,
  name,
}: {
  state: AdminActionState;
  name: string;
}) {
  return state.fieldErrors?.[name] ? (
    <p className="mt-2 text-xs text-red-800">{state.fieldErrors[name]}</p>
  ) : null;
}

export function BoxForm({
  box,
  products,
  selectedProductIds,
}: {
  box?: Tables<"boxes">;
  products: ProductChoice[];
  selectedProductIds: string[];
}) {
  const [state, formAction, pending] = useActionState<
    AdminActionState,
    FormData
  >(saveBoxAction, initialAdminActionState);
  const selectedProducts = new Set(selectedProductIds);

  return (
    <form action={formAction} className="space-y-8" aria-busy={pending}>
      {box && <input type="hidden" name="id" value={box.id} />}

      {state.message && (
        <p
          aria-live="polite"
          className="border border-red-900/20 bg-red-50 px-4 py-3 text-xs text-red-900"
        >
          {state.message}
        </p>
      )}

      <section className="border border-border bg-white p-6 sm:p-8">
        <p className="eyebrow">Box identity</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="box-name">
              Name
            </label>
            <input
              id="box-name"
              name="name"
              defaultValue={box?.name}
              required
              className={inputClass}
            />
            <ErrorText state={state} name="name" />
          </div>
          <div>
            <label className={labelClass} htmlFor="box-slug">
              URL slug
            </label>
            <input
              id="box-slug"
              name="slug"
              defaultValue={box?.slug}
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              className={inputClass}
            />
            <ErrorText state={state} name="slug" />
          </div>
          <div>
            <label className={labelClass} htmlFor="box-occasion">
              Occasion
            </label>
            <input
              id="box-occasion"
              name="occasion"
              defaultValue={box?.occasion}
              required
              className={inputClass}
            />
            <ErrorText state={state} name="occasion" />
          </div>
          <div>
            <label className={labelClass} htmlFor="box-status">
              Status
            </label>
            <select
              id="box-status"
              name="status"
              defaultValue={box?.status ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="box-description">
              Description
            </label>
            <textarea
              id="box-description"
              name="description"
              defaultValue={box?.description}
              required
              className="mt-2 min-h-28 w-full border border-border px-4 py-3 text-sm leading-6"
            />
            <ErrorText state={state} name="description" />
          </div>
          <div>
            <label className={labelClass} htmlFor="box-placeholder">
              Image placeholder label
            </label>
            <input
              id="box-placeholder"
              name="placeholderImageLabel"
              defaultValue={box?.placeholder_image_label ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="box-position">
              Display position
            </label>
            <input
              id="box-position"
              name="position"
              type="number"
              min="0"
              step="1"
              defaultValue={box?.position ?? 0}
              required
              className={inputClass}
            />
            <ErrorText state={state} name="position" />
          </div>
        </div>
      </section>

      <section className="border border-border bg-white p-6 sm:p-8">
        <p className="eyebrow">Pricing</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="box-individual-total">
              Individual total in TND
            </label>
            <input
              id="box-individual-total"
              name="individualTotalPriceTnd"
              type="number"
              min="0"
              step="0.001"
              defaultValue={box?.individual_total_price_tnd ?? ""}
              required
              className={inputClass}
            />
            <ErrorText state={state} name="individualTotalPriceTnd" />
          </div>
          <div>
            <label className={labelClass} htmlFor="box-price">
              Box price in TND
            </label>
            <input
              id="box-price"
              name="boxPriceTnd"
              type="number"
              min="0"
              step="0.001"
              defaultValue={box?.box_price_tnd ?? ""}
              required
              className={inputClass}
            />
            <ErrorText state={state} name="boxPriceTnd" />
          </div>
        </div>
      </section>

      <section className="border border-border bg-white p-6 sm:p-8">
        <p className="eyebrow">Included products</p>
        <div className="mt-6 grid gap-px border border-border bg-border md:grid-cols-2">
          {products.map((product) => (
            <label
              key={product.id}
              className="flex min-h-16 items-center justify-between gap-4 bg-off-white px-4"
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="productIds"
                  value={product.id}
                  defaultChecked={selectedProducts.has(product.id)}
                  className="size-4 accent-black"
                />
                <span>
                  <span className="block text-sm">{product.name}</span>
                  <span className="mt-1 block text-[9px] uppercase tracking-[0.12em] text-charcoal">
                    {product.status}
                  </span>
                </span>
              </span>
              <span className="text-xs">
                {product.base_price_tnd.toFixed(3)} TND
              </span>
            </label>
          ))}
        </div>
        <ErrorText state={state} name="productIds" />
      </section>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 border border-border bg-white/95 p-4 shadow-[0_12px_35px_rgba(17,17,17,0.1)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-charcoal">
          Product membership and pricing are saved together.
        </p>
        <Button
          type="submit"
          loading={pending}
          loadingLabel="Saving box"
          className="w-full sm:w-auto"
        >
          {box ? "Save box" : "Create box"}
        </Button>
      </div>
    </form>
  );
}
