import type { Metadata } from "next";
import { BoxForm } from "@/components/admin/box-form";
import { requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "New Box" };

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
        <p className="eyebrow">Boxes · New record</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
          Create box
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
          Assemble a complete direction from existing products and publish it
          only when pricing and content are ready.
        </p>
      </header>
      <div className="mt-8">
        <BoxForm products={products ?? []} selectedProductIds={[]} />
      </div>
    </div>
  );
}
