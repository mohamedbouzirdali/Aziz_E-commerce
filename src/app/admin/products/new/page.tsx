import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";
import { requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Nouveau produit" };

export default async function NewProductPage() {
  await requireStaff();
  const supabase = await createClient();
  const [
    { data: categories },
    { data: collections },
    { data: optionTypes },
    { data: optionValues },
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name")
      .eq("is_active", true)
      .order("position"),
    supabase
      .from("collections")
      .select("id, name")
      .eq("is_active", true)
      .order("position"),
    supabase.from("option_types").select("id, code").order("position"),
    supabase
      .from("option_values")
      .select("id, code, label, option_type_id, swatch_hex")
      .order("position"),
  ]);

  return (
    <div>
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Catalogue · Nouvelle fiche</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
          Nouveau produit
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
          Créez la fiche en brouillon, définissez les variantes, puis publiez
          lorsque les textes et images sont prêts.
        </p>
      </header>
      <div className="mt-8">
        <ProductForm
          categories={categories ?? []}
          collections={collections ?? []}
          optionTypes={optionTypes ?? []}
          optionValues={optionValues ?? []}
          selectedCollectionIds={[]}
          selectedOptionValueIds={[]}
        />
      </div>
    </div>
  );
}
