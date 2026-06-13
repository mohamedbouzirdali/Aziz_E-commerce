import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Boxes" };

export default async function AdminBoxesPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  await requireStaff();
  const params = await searchParams;
  const supabase = await createClient();
  const { data: boxes, error } = await supabase
    .from("boxes")
    .select(
      "id, slug, name, occasion, status, individual_total_price_tnd, box_price_tnd, updated_at",
    )
    .order("position");

  return (
    <div>
      <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Curated value</p>
          <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
            Boxes
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
            Compose occasion-led bundles with canonical products, clear totals,
            and validated savings.
          </p>
        </div>
        <Button href="/admin/boxes/new">New box</Button>
      </header>

      {params.notice === "box-archived" && (
        <p className="mt-6 border border-black/15 bg-white px-4 py-3 text-xs">
          The box was archived.
        </p>
      )}

      {error ? (
        <p className="mt-8 border border-red-900/20 bg-red-50 p-5 text-sm text-red-900">
          Boxes are unavailable until the hosted migration is applied.
        </p>
      ) : (
        <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2">
          {(boxes ?? []).map((box) => {
            const savings =
              box.individual_total_price_tnd - box.box_price_tnd;
            return (
              <Link
                key={box.id}
                href={`/admin/boxes/${box.id}`}
                className="group bg-white p-6 transition-colors hover:bg-black hover:text-white"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-charcoal group-hover:text-white/55">
                      {box.occasion} · {box.status}
                    </p>
                    <h2 className="mt-3 font-serif text-3xl">{box.name}</h2>
                  </div>
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </div>
                <div className="mt-8 flex items-end justify-between border-t border-border pt-5 group-hover:border-white/25">
                  <p className="text-sm">{box.box_price_tnd.toFixed(3)} TND</p>
                  <p className="text-[9px] uppercase tracking-[0.12em] text-charcoal group-hover:text-white/55">
                    Save {savings.toFixed(3)} TND
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
