"use client";

import { useActionState } from "react";
import { saveProductAction } from "@/app/admin/products/actions";
import { Button } from "@/components/ui/button";
import {
  initialAdminActionState,
  type AdminActionState,
} from "@/lib/admin/forms";
import type { Tables } from "@/lib/supabase/database.types";

type Category = Pick<Tables<"categories">, "id" | "name">;
type Collection = Pick<Tables<"collections">, "id" | "name">;
type OptionValue = Pick<
  Tables<"option_values">,
  "id" | "code" | "label" | "option_type_id" | "swatch_hex"
>;
type OptionType = Pick<Tables<"option_types">, "id" | "code">;

const inputClass =
  "mt-2 min-h-12 w-full border border-border bg-white px-4 text-sm outline-none transition-colors focus:border-black";
const textareaClass =
  "mt-2 min-h-28 w-full resize-y border border-border bg-white px-4 py-3 text-sm leading-6 outline-none transition-colors focus:border-black";
const labelClass =
  "text-[10px] font-semibold uppercase tracking-[0.16em]";

function FieldError({
  state,
  name,
}: {
  state: AdminActionState;
  name: string;
}) {
  const message = state.fieldErrors?.[name];
  return message ? (
    <p className="mt-2 text-xs text-red-800">{message}</p>
  ) : null;
}

export function ProductForm({
  product,
  categories,
  collections,
  optionTypes,
  optionValues,
  selectedCollectionIds,
  selectedOptionValueIds,
}: {
  product?: Tables<"products">;
  categories: Category[];
  collections: Collection[];
  optionTypes: OptionType[];
  optionValues: OptionValue[];
  selectedCollectionIds: string[];
  selectedOptionValueIds: string[];
}) {
  const [state, formAction, pending] = useActionState<
    AdminActionState,
    FormData
  >(saveProductAction, initialAdminActionState);
  const colorTypeId = optionTypes.find((type) => type.code === "color")?.id;
  const sizeTypeId = optionTypes.find((type) => type.code === "size")?.id;
  const colors = optionValues.filter(
    (option) => option.option_type_id === colorTypeId,
  );
  const sizes = optionValues.filter(
    (option) => option.option_type_id === sizeTypeId,
  );
  const selectedOptions = new Set(selectedOptionValueIds);
  const selectedCollections = new Set(selectedCollectionIds);

  return (
    <form action={formAction} className="space-y-8" aria-busy={pending}>
      {product && <input type="hidden" name="id" value={product.id} />}

      {state.message && (
        <p
          aria-live="polite"
          className="border border-red-900/20 bg-red-50 px-4 py-3 text-xs leading-5 text-red-900"
        >
          {state.message}
        </p>
      )}

      <section className="border border-border bg-white p-6 sm:p-8">
        <div className="border-b border-border pb-5">
          <p className="eyebrow">01 · Merchandising identity</p>
          <h2 className="mt-3 font-serif text-3xl">Product information</h2>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="product-name">
              Product name
            </label>
            <input
              id="product-name"
              name="name"
              defaultValue={product?.name}
              required
              className={inputClass}
            />
            <FieldError state={state} name="name" />
          </div>
          <div>
            <label className={labelClass} htmlFor="product-slug">
              URL slug
            </label>
            <input
              id="product-slug"
              name="slug"
              defaultValue={product?.slug}
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              className={inputClass}
            />
            <FieldError state={state} name="slug" />
          </div>
          <div>
            <label className={labelClass} htmlFor="product-category">
              Category
            </label>
            <select
              id="product-category"
              name="categoryId"
              defaultValue={product?.category_id ?? ""}
              className={inputClass}
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="product-status">
              Publishing status
            </label>
            <select
              id="product-status"
              name="status"
              defaultValue={product?.status ?? "draft"}
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="product-short-description">
              Short description
            </label>
            <input
              id="product-short-description"
              name="shortDescription"
              defaultValue={product?.short_description ?? ""}
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="product-description">
              Full description
            </label>
            <textarea
              id="product-description"
              name="description"
              defaultValue={product?.description}
              required
              className={textareaClass}
            />
            <FieldError state={state} name="description" />
          </div>
        </div>
      </section>

      <section className="border border-border bg-white p-6 sm:p-8">
        <div className="border-b border-border pb-5">
          <p className="eyebrow">02 · Commercial details</p>
          <h2 className="mt-3 font-serif text-3xl">Price and placement</h2>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="product-price">
              Base price in TND
            </label>
            <input
              id="product-price"
              name="basePriceTnd"
              type="number"
              min="0"
              step="0.001"
              defaultValue={product?.base_price_tnd ?? ""}
              required
              className={inputClass}
            />
            <FieldError state={state} name="basePriceTnd" />
          </div>
          <div>
            <label className={labelClass} htmlFor="product-badges">
              Badges
            </label>
            <input
              id="product-badges"
              name="badges"
              defaultValue={product?.badges.join(", ") ?? ""}
              placeholder="New, Limited"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="product-image-ratio">
              Image ratio
            </label>
            <select
              id="product-image-ratio"
              name="imageRatio"
              defaultValue={product?.image_ratio ?? "portrait"}
              className={inputClass}
            >
              <option value="portrait">Portrait</option>
              <option value="square">Square</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          <div className="flex flex-wrap items-end gap-6 pb-3">
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <input
                type="checkbox"
                name="isNew"
                defaultChecked={product?.is_new}
                className="size-4 accent-black"
              />
              New arrival
            </label>
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <input
                type="checkbox"
                name="isBestSeller"
                defaultChecked={product?.is_best_seller}
                className="size-4 accent-black"
              />
              Best seller
            </label>
          </div>
          <fieldset className="md:col-span-2">
            <legend className={labelClass}>Collections</legend>
            <div className="mt-3 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <label
                  key={collection.id}
                  className="flex min-h-12 items-center gap-3 bg-off-white px-4 text-sm"
                >
                  <input
                    type="checkbox"
                    name="collectionIds"
                    value={collection.id}
                    defaultChecked={selectedCollections.has(collection.id)}
                    className="size-4 accent-black"
                  />
                  {collection.name}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <section className="border border-border bg-white p-6 sm:p-8">
        <div className="border-b border-border pb-5">
          <p className="eyebrow">03 · Sellable variants</p>
          <h2 className="mt-3 font-serif text-3xl">Colors and sizes</h2>
          <p className="mt-3 max-w-2xl text-xs leading-6 text-charcoal">
            Saving generates every selected color and size combination. Existing
            matching SKUs and inventory are preserved.
          </p>
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <fieldset>
            <legend className={labelClass}>Colors</legend>
            <div className="mt-3 grid gap-px border border-border bg-border sm:grid-cols-2">
              {colors.map((color) => (
                <label
                  key={color.id}
                  className="flex min-h-12 items-center gap-3 bg-off-white px-4 text-sm"
                >
                  <input
                    type="checkbox"
                    name="colorCodes"
                    value={color.code}
                    defaultChecked={selectedOptions.has(color.id)}
                    className="size-4 accent-black"
                  />
                  <span
                    aria-hidden
                    className="size-4 border border-black/20"
                    style={{ backgroundColor: color.swatch_hex ?? "#ffffff" }}
                  />
                  {color.label}
                </label>
              ))}
            </div>
            <FieldError state={state} name="colorCodes" />
          </fieldset>
          <fieldset>
            <legend className={labelClass}>Sizes</legend>
            <div className="mt-3 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3">
              {sizes.map((size) => (
                <label
                  key={size.id}
                  className="flex min-h-12 items-center gap-3 bg-off-white px-4 text-sm"
                >
                  <input
                    type="checkbox"
                    name="sizeCodes"
                    value={size.code}
                    defaultChecked={selectedOptions.has(size.id)}
                    className="size-4 accent-black"
                  />
                  {size.label}
                </label>
              ))}
            </div>
            <FieldError state={state} name="sizeCodes" />
          </fieldset>
        </div>
      </section>

      <section className="border border-border bg-white p-6 sm:p-8">
        <div className="border-b border-border pb-5">
          <p className="eyebrow">04 · Product confidence</p>
          <h2 className="mt-3 font-serif text-3xl">Details and care</h2>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[
            { name: "details", label: "Details", value: product?.details },
            {
              name: "composition",
              label: "Composition",
              value: product?.composition,
            },
            { name: "fit", label: "Fit", value: product?.fit },
            { name: "care", label: "Care", value: product?.care },
            {
              name: "deliveryNote",
              label: "Delivery",
              value: product?.delivery_note,
            },
            {
              name: "returnsNote",
              label: "Returns",
              value: product?.returns_note,
            },
          ].map((field) => (
            <div key={field.name}>
              <label
                className={labelClass}
                htmlFor={`product-${field.name}`}
              >
                {field.label}
              </label>
              <textarea
                id={`product-${field.name}`}
                name={field.name}
                defaultValue={field.value ?? ""}
                className={textareaClass}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="border border-border bg-white p-6 sm:p-8">
        <div className="border-b border-border pb-5">
          <p className="eyebrow">05 · Search presentation</p>
          <h2 className="mt-3 font-serif text-3xl">SEO</h2>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="product-seo-title">
              SEO title
            </label>
            <input
              id="product-seo-title"
              name="seoTitle"
              defaultValue={product?.seo_title ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="product-seo-description">
              SEO description
            </label>
            <textarea
              id="product-seo-description"
              name="seoDescription"
              defaultValue={product?.seo_description ?? ""}
              className={textareaClass}
            />
          </div>
        </div>
      </section>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 border border-border bg-white/95 p-4 shadow-[0_12px_35px_rgba(17,17,17,0.1)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-charcoal">
          Saving is transactional. A validation failure leaves the current
          product unchanged.
        </p>
        <Button
          type="submit"
          loading={pending}
          loadingLabel="Saving product"
          className="w-full shrink-0 sm:w-auto"
        >
          {product ? "Save product" : "Create product"}
        </Button>
      </div>
    </form>
  );
}
