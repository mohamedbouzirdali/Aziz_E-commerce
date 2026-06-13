import Link from "next/link";
import { requireStaff } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

const managementAreas = [
  {
    href: "/admin/products",
    title: "Catalog",
    description: "Products, variants, options, pricing, publishing, and care details.",
  },
  {
    href: "/admin/inventory",
    title: "Inventory",
    description: "Variant stock, reservations, thresholds, and adjustment history.",
  },
  {
    href: "/admin/homepage",
    title: "Homepage",
    description: "Editorial sections, featured products, boxes, images, and ordering.",
  },
  {
    href: "/admin/media",
    title: "Media",
    description: "Catalog assets, image metadata, alt text, and placement references.",
  },
];

export default async function AdminDashboardPage() {
  await requireStaff();
  const supabase = await createClient();
  const [
    productsResult,
    variantsResult,
    boxesResult,
    sectionsResult,
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("product_variants").select("*", { count: "exact", head: true }),
    supabase.from("boxes").select("*", { count: "exact", head: true }),
    supabase.from("homepage_sections").select("*", { count: "exact", head: true }),
  ]);

  const metrics = [
    ["Products", productsResult.count, productsResult.error],
    ["Variants", variantsResult.count, variantsResult.error],
    ["Boxes", boxesResult.count, boxesResult.error],
    ["Homepage sections", sectionsResult.count, sectionsResult.error],
  ] as const;

  return (
    <div>
      <header className="border-b border-border pb-8">
        <p className="eyebrow">Commerce overview</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">
          Admin workspace
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
          Manage the catalog and editorial storefront through focused,
          permission-protected tools.
        </p>
      </header>

      <section className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, count, error]) => (
          <div key={label} className="bg-white p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
              {label}
            </p>
            <p className="mt-5 font-serif text-5xl">
              {error ? "—" : (count ?? 0)}
            </p>
            <p className="mt-3 text-xs text-charcoal">
              {error ? "Unavailable until migration is applied" : "Live database total"}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Management areas</p>
            <h2 className="mt-3 font-serif text-4xl">Core operations</h2>
          </div>
          <p className="hidden max-w-xs text-right text-xs leading-5 text-charcoal sm:block">
            Every write action will recheck staff permissions server-side.
          </p>
        </div>

        <div className="mt-7 grid gap-px border border-border bg-border md:grid-cols-2">
          {managementAreas.map((area) => (
            <Link
              key={area.href}
              href={area.href}
              className="group bg-white p-6 transition-colors hover:bg-black hover:text-white"
            >
              <div className="flex items-start justify-between gap-5">
                <h3 className="font-serif text-3xl">{area.title}</h3>
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1.5"
                >
                  →
                </span>
              </div>
              <p className="mt-4 max-w-md text-xs leading-6 text-charcoal transition-colors group-hover:text-white/65">
                {area.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
