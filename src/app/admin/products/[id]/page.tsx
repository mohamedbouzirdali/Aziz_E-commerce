import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archiveProductAction } from "@/app/admin/products/actions";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; notice?: string }>;
}) {
  await requireStaff();
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const [
    { data: product },
    { data: categories },
    { data: collections },
    { data: optionTypes },
    { data: optionValues },
    { data: productCollections },
    { data: productOptionValues },
  ] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name").order("position"),
    supabase.from("collections").select("id, name").order("position"),
    supabase.from("option_types").select("id, code").order("position"),
    supabase
      .from("option_values")
      .select("id, code, label, option_type_id, swatch_hex")
      .order("position"),
    supabase
      .from("product_collections")
      .select("collection_id")
      .eq("product_id", id),
    supabase
      .from("product_option_values")
      .select("option_value_id")
      .eq("product_id", id),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Catalog · Product editor</p>
          <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
            {product.name}
          </h1>
          <p className="mt-5 text-sm text-charcoal">
            Last updated{" "}
            {new Intl.DateTimeFormat("en", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(product.updated_at))}
          </p>
        </div>
        {product.status !== "archived" && (
          <form action={archiveProductAction}>
            <input type="hidden" name="id" value={product.id} />
            <Button type="submit" variant="secondary">
              Archive product
            </Button>
          </form>
        )}
      </header>

      {query.saved === "1" && (
        <p className="mt-6 border border-black/15 bg-white px-4 py-3 text-xs">
          Product saved successfully.
        </p>
      )}
      {query.notice === "archive-failed" && (
        <p className="mt-6 border border-red-900/20 bg-red-50 px-4 py-3 text-xs text-red-900">
          The product could not be archived.
        </p>
      )}

      <div className="mt-8">
        <ProductForm
          product={product}
          categories={categories ?? []}
          collections={collections ?? []}
          optionTypes={optionTypes ?? []}
          optionValues={optionValues ?? []}
          selectedCollectionIds={(productCollections ?? []).map(
            (row) => row.collection_id,
          )}
          selectedOptionValueIds={(productOptionValues ?? []).map(
            (row) => row.option_value_id,
          )}
        />
      </div>
    </div>
  );
}
