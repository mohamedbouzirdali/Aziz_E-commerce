import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductExperience } from "@/components/product/product-experience";
import { JsonLd } from "@/components/seo/json-ld";
import { getProductBySlug, products } from "@/data";
import { formatTnd } from "@/lib/format";
import { absoluteUrl, siteConfig } from "@/lib/seo";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  if (!product) return { title: "Product" };
  return {
    title: { absolute: `${product.name} | ${siteConfig.name}` },
    description: `${product.description} Available for ${formatTnd(product.priceTnd)}.`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | ${siteConfig.name}`,
      description: product.description,
      url: `/product/${product.slug}`,
      images: [{ url: siteConfig.ogImage, alt: product.placeholderImageLabel }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | ${siteConfig.name}`,
      description: product.description,
      images: [siteConfig.ogImage],
    },
  };
}

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();
  const related = products.filter((item) => item.id !== product.id);
  const availability =
    product.availability === "out-of-stock"
      ? "https://schema.org/OutOfStock"
      : product.availability === "low-stock"
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/InStock";

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            sku: product.id,
            brand: { "@type": "Brand", name: siteConfig.name },
            image: [absoluteUrl(siteConfig.ogImage)],
            color: product.colors.map((color) => color.name).join(", "),
            offers: {
              "@type": "Offer",
              url: absoluteUrl(`/product/${product.slug}`),
              priceCurrency: "TND",
              price: product.priceTnd,
              availability,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
              { "@type": "ListItem", position: 3, name: product.name, item: absoluteUrl(`/product/${product.slug}`) },
            ],
          },
        ]}
      />
      <ProductExperience product={product} related={related} />
    </>
  );
}
