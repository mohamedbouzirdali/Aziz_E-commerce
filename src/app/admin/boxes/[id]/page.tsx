import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { archiveBoxAction } from "@/app/admin/boxes/actions";
import { BoxForm } from "@/components/admin/box-form";
import { Button } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Edit Box" };

export default async function EditBoxPage({
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
  const [{ data: box }, { data: products }, { data: items }] =
    await Promise.all([
      supabase.from("boxes").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("products")
        .select("id, name, base_price_tnd, status")
        .neq("status", "archived")
        .order("name"),
      supabase
        .from("box_items")
        .select("product_id")
        .eq("box_id", id)
        .order("position"),
    ]);

  if (!box) {
    notFound();
  }

  return (
    <div>
      <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Boxes · Editor</p>
          <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
            {box.name}
          </h1>
        </div>
        {box.status !== "archived" && (
          <form action={archiveBoxAction}>
            <input type="hidden" name="id" value={box.id} />
            <Button type="submit" variant="secondary">
              Archive box
            </Button>
          </form>
        )}
      </header>

      {query.saved === "1" && (
        <p className="mt-6 border border-black/15 bg-white px-4 py-3 text-xs">
          Box saved successfully.
        </p>
      )}
      {query.notice === "archive-failed" && (
        <p className="mt-6 border border-red-900/20 bg-red-50 px-4 py-3 text-xs text-red-900">
          The box could not be archived.
        </p>
      )}

      <div className="mt-8">
        <BoxForm
          box={box}
          products={products ?? []}
          selectedProductIds={(items ?? []).map((item) => item.product_id)}
        />
      </div>
    </div>
  );
}
