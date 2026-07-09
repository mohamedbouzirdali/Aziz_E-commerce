import type { Metadata } from "next";
import { BoxForm } from "@/components/admin/box-form";
import { requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Nouveau coffret" };

export default async function NewBoxPage() {
  await requireStaff();
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, base_price_tnd, status")
    .neq("status", "archived")
    .order("name");

  return (
    <div>
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Coffrets · Nouvelle fiche</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
          Nouveau coffret
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
          Assemblez une sélection complète à partir des produits existants,
          puis publiez-la lorsque le prix et le contenu sont prêts.
        </p>
      </header>
      <div className="mt-8">
        <BoxForm products={products ?? []} selectedProductIds={[]} />
      </div>
    </div>
  );
}
