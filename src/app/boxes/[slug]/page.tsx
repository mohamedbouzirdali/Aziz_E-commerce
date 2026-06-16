import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/cards/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { boxes, getBoxBySlug, products } from "@/data";
import { formatTnd } from "@/lib/format";
import { siteConfig } from "@/lib/seo";

type BoxPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: BoxPageProps): Promise<Metadata> {
  const box = getBoxBySlug((await params).slug);
  if (!box) return { title: "Box" };
  return {
    title: { absolute: `${box.name} | ${siteConfig.name}` },
    description: `${box.description} Économisez ${formatTnd(box.savingsTnd)} avec cette capsule sélectionnée.`,
    alternates: { canonical: `/boxes/${box.slug}` },
    openGraph: {
      title: `${box.name} | ${siteConfig.name}`,
      description: box.description,
      url: `/boxes/${box.slug}`,
      images: [{ url: siteConfig.ogImage, alt: box.placeholderImageLabel }],
    },
  };
}

export function generateStaticParams() {
  return boxes.map(({ slug }) => ({ slug }));
}

export default async function BoxPage({ params }: BoxPageProps) {
  const box = getBoxBySlug((await params).slug);
  if (!box) notFound();
  const included = box.includedProductIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product) => product !== undefined);

  return (
    <>
      <div className="page-shell py-5">
        <Breadcrumbs items={[
          { label: "Accueil", href: "/" },
          { label: "Coffrets", href: "/boxes" },
          { label: box.name },
        ]} />
      </div>
      <div className="page-shell grid gap-10 pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
        <ImagePlaceholder
          label={box.placeholderImageLabel}
          ratio="square"
          src={box.imageUrl}
          alt={box.placeholderImageLabel}
        />
        <div className="lg:py-8">
          <p className="eyebrow">Édit {box.occasion.toLowerCase()} · {included.length} pièces</p>
          <h1 className="mt-4 font-serif text-4xl leading-none min-[390px]:text-5xl sm:text-6xl">{box.name}</h1>
          <p className="mt-6 text-sm leading-6 text-charcoal">{box.description}</p>
          <div className="mt-8 flex items-end gap-4 border-y border-border py-5">
            <p className="text-xl">{formatTnd(box.boxPriceTnd)}</p>
            <p className="text-sm text-charcoal/50 line-through">
              {formatTnd(box.individualTotalPriceTnd)}
            </p>
            <p className="ml-auto text-xs font-semibold uppercase tracking-[0.12em]">
              Économisez {formatTnd(box.savingsTnd)}
            </p>
          </div>
          <div className="mt-7">
            <p className="eyebrow">Dans la box</p>
            <ol className="mt-4 divide-y divide-border border-y border-border">
              {included.map((product, index) => (
                <li key={product.id} className="flex justify-between gap-5 py-4 text-sm">
                  <span>{String(index + 1).padStart(2, "0")} · {product.name}</span>
                  <span>{formatTnd(product.priceTnd)}</span>
                </li>
              ))}
            </ol>
          </div>
          <Button className="mt-8 w-full">Choisir les tailles</Button>
          <p className="mt-3 text-center text-xs text-charcoal/60">
            La sélection des tailles et la logique panier des boxes arriveront dans la prochaine phase du parcours d’achat.
          </p>
        </div>
      </div>
      <section className="border-t border-border bg-off-white py-16">
        <div className="page-shell">
          <h2 className="font-serif text-4xl">Pièces incluses</h2>
          <div className="mt-8 grid grid-cols-1 gap-y-10 min-[380px]:grid-cols-2 min-[380px]:gap-x-4 lg:grid-cols-3 lg:gap-x-6">
            {included.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>
    </>
  );
}
