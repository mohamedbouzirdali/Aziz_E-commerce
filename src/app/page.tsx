import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminEditableImage,
  AdminSectionEditLink,
  AdminStorefrontControlsProvider,
} from "@/components/admin/storefront-edit-controls";
import { ProductCard } from "@/components/cards/product-card";
import { Reveal } from "@/components/motion/reveal";
import {
  EditorialHero,
  type EditorialHeroImage,
} from "@/components/sections/editorial-hero";
import { NewsletterBlock } from "@/components/sections/newsletter-block";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { products } from "@/data";
import {
  getHomepageContent,
  type HomepageContentItem,
  type HomepageContentSection,
} from "@/lib/homepage/content";
import { siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contemporary Womenswear in Tunisia",
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Élan | Contemporary Womenswear in Tunisia",
    description: siteConfig.description,
    url: "/",
  },
};

const heroFallbackImage = "/images/homepage/evoflex-hero-reference.png";

const lifestyleFallbackImage =
  "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1600&q=82";

const communityFallbackImages = [
  "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1506629905607-c52b1ea7d3f6?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=82",
];

const qualityFeatures = [
  {
    title: "Soft-touch fabric",
    body: "Buttery-soft feel with breathable performance.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="size-7">
        <path
          d="M5 15.5a4.5 4.5 0 0 1 1.7-8.66A5.5 5.5 0 0 1 17 8.4a3.75 3.75 0 1 1 .75 7.1H7.25"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
      </svg>
    ),
  },
  {
    title: "Sculpting fit",
    body: "Designed to support, smooth, and move with you.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="size-7">
        <path
          d="M8 4c0 4-2 5.5-2 8s1.5 8 6 8 6-5 6-8-2-4-2-8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
      </svg>
    ),
  },
  {
    title: "Everyday comfort",
    body: "Lightweight, flexible, and made to live in.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="size-7">
        <path
          d="M4 15.5a4.5 4.5 0 0 1 4.5-4.5c1.1 0 2.2.4 3 1.15A5.5 5.5 0 0 1 21 15.5a3.5 3.5 0 0 1-3.5 3.5h-10A3.5 3.5 0 0 1 4 15.5Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
      </svg>
    ),
  },
  {
    title: "Designed to move with you",
    body: "Thoughtful details for every workout and every day.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="size-7">
        <path
          d="M4 12h14m0 0-4-4m4 4-4 4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
      </svg>
    ),
  },
];

function sectionTextIgnoringLegacy(
  section: HomepageContentSection | undefined,
  field: "eyebrow" | "heading" | "body",
  fallback: string,
  legacy: Record<"eyebrow" | "heading" | "body", string>,
) {
  const current = section?.[field];

  if (!current || current === legacy[field]) {
    return fallback;
  }

  return current;
}

function featuredHomepageProducts(
  section: HomepageContentSection | undefined,
  desiredCount = 4,
) {
  const selected = section
    ? section.items
        .map((item) =>
          products.find((product) => product.slug === item.productSlug),
        )
        .filter((product): product is (typeof products)[number] =>
          Boolean(product),
        )
    : [];

  const selectedIds = new Set(selected.map((product) => product.id));
  const supplemental = products.filter((product) => !selectedIds.has(product.id));

  return [...selected, ...supplemental].slice(0, desiredCount);
}

function communityGalleryItems(
  items: HomepageContentItem[] | undefined,
  count = 6,
) {
  return Array.from({ length: count }, (_, index) => {
    const item = items?.[index];

    return {
      id: item?.id ?? `community-${index}`,
      itemId: item?.id,
      href: item?.cta_href || "/shop",
      label:
        item?.media?.altText ||
        item?.placeholder_label ||
        item?.title_override ||
        `Community image ${index + 1}`,
      src: item?.media?.url || communityFallbackImages[index],
    };
  });
}

export default async function HomePage() {
  const cmsSections = await getHomepageContent();
  const sectionMap = new Map(
    (cmsSections ?? []).map((section) => [section.section_key, section]),
  );

  const heroSection = sectionMap.get("hero");
  const featuredSection = sectionMap.get("new-arrivals");
  const lifestyleSection = sectionMap.get("editorial-story");
  const communitySection =
    sectionMap.get("curated-edits") ?? sectionMap.get("categories");
  const newsletterSection = sectionMap.get("newsletter");

  const heroItem = heroSection?.items[0];
  const lifestyleItem = lifestyleSection?.items[0];
  const heroImages: EditorialHeroImage[] = [
    {
      label:
        heroItem?.media?.altText ||
        heroItem?.placeholder_label ||
        "Premium activewear campaign",
      src: heroItem?.media?.url || heroFallbackImage,
      itemId: heroItem?.id,
    },
  ];

  const featuredProducts = featuredHomepageProducts(featuredSection, 4);
  const communityImages = communityGalleryItems(communitySection?.items, 6);

  return (
    <AdminStorefrontControlsProvider>
      <main className="bg-[#fbf8f2] text-[#1e1e1e]">
        <div className="relative">
          <AdminSectionEditLink sectionKey="hero" />
          <EditorialHero
            eyebrow="Premium activewear"
            heading="Move with intention."
            body="Premium activewear for women building a lifestyle of confidence, balance, and discipline."
            images={heroImages}
            primaryCta={{ href: "/shop?sort=newest", label: "Shop Collection" }}
            secondaryCta={{
              href: "#lifestyle",
              label: "Discover the Lifestyle",
            }}
          />
        </div>

        <section className="page-shell border-b border-black/10 py-12 sm:py-16">
          <Reveal className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
            <div className="max-w-xl">
              <p className="eyebrow text-black/55">Our philosophy</p>
              <h2 className="mt-4 max-w-md font-serif text-4xl leading-[0.96] sm:text-5xl">
                Movement is more than exercise.
              </h2>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-sm leading-7 text-black/70 sm:text-base">
                It&apos;s how we show up for ourselves — mind, body, and life. We
                design pieces that support your goals, elevate your routine, and
                move with you through every season of becoming.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:text-black/65"
              >
                Learn more about ÉLAN <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </section>

        <section className="page-shell py-14 sm:py-18 lg:py-20">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow text-black/55">
                {sectionTextIgnoringLegacy(
                  featuredSection,
                  "eyebrow",
                  "Featured collection",
                  {
                    eyebrow: "Just arrived",
                    heading: "New forms",
                    body: "Only a focused row of products lives on the homepage. The rest of the page keeps the brand image-led.",
                  },
                )}
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-[0.96] sm:text-5xl">
                {sectionTextIgnoringLegacy(
                  featuredSection,
                  "heading",
                  "Elevated essentials for every move.",
                  {
                    eyebrow: "Just arrived",
                    heading: "New forms",
                    body: "Only a focused row of products lives on the homepage. The rest of the page keeps the brand image-led.",
                  },
                )}
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:text-black/65"
            >
              Shop all <span aria-hidden>→</span>
            </Link>
          </Reveal>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section
          id="lifestyle"
          className="page-shell pb-14 sm:pb-18 lg:pb-20"
        >
          <div className="relative">
            <AdminSectionEditLink sectionKey="editorial-story" />
            <Reveal className="grid overflow-hidden border border-black/10 bg-[#ede5d8] lg:grid-cols-[1.08fr_0.92fr]">
              <AdminEditableImage
                itemId={lifestyleItem?.id}
                label={
                  lifestyleItem?.media?.altText ||
                  lifestyleItem?.placeholder_label ||
                  "Lifestyle editorial image"
                }
                className="min-h-full"
              >
                <ImagePlaceholder
                  label={
                    lifestyleItem?.media?.altText ||
                    lifestyleItem?.placeholder_label ||
                    "Lifestyle editorial image"
                  }
                  src={lifestyleItem?.media?.url || lifestyleFallbackImage}
                  alt={
                    lifestyleItem?.media?.altText ||
                    lifestyleItem?.placeholder_label ||
                    "Lifestyle editorial image"
                  }
                  ratio="landscape"
                  className="h-full min-h-[300px] border-b border-black/10 lg:min-h-[460px] lg:border-b-0 lg:border-r"
                />
              </AdminEditableImage>
              <div className="flex flex-col justify-center px-6 py-10 sm:px-8 lg:px-12">
                <p className="eyebrow text-black/55">
                  {sectionTextIgnoringLegacy(
                    lifestyleSection,
                    "eyebrow",
                    "Lifestyle",
                    {
                      eyebrow: "The journal · Study 01",
                      heading: "The architecture of ease.",
                      body: "Fluid tailoring and clean foundations, designed to hold their shape while leaving space for yours.",
                    },
                  )}
                </p>
                <h2 className="mt-4 max-w-md font-serif text-4xl leading-[0.96] sm:text-5xl">
                  {sectionTextIgnoringLegacy(
                    lifestyleSection,
                    "heading",
                    "More than activewear.",
                    {
                      eyebrow: "The journal · Study 01",
                      heading: "The architecture of ease.",
                      body: "Fluid tailoring and clean foundations, designed to hold their shape while leaving space for yours.",
                    },
                  )}
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-black/68">
                  {sectionTextIgnoringLegacy(
                    lifestyleSection,
                    "body",
                    "We believe in balance — strong bodies, clear minds, and lives that feel aligned. ÉLAN is here to inspire the routines, rituals, and moments that make you feel your best.",
                    {
                      eyebrow: "The journal · Study 01",
                      heading: "The architecture of ease.",
                      body: "Fluid tailoring and clean foundations, designed to hold their shape while leaving space for yours.",
                    },
                  )}
                </p>
                <Link
                  href="/about"
                  className="mt-8 inline-flex w-fit items-center gap-3 bg-[#8d9684] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#75806b]"
                >
                  Discover the lifestyle <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="page-shell border-y border-black/10 py-10 sm:py-12">
          <Reveal className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {qualityFeatures.map((feature) => (
              <article
                key={feature.title}
                className="text-center lg:border-r lg:border-black/10 lg:px-5 last:lg:border-r-0"
              >
                <div className="mx-auto flex justify-center text-black/75">
                  {feature.icon}
                </div>
                <h3 className="mt-4 font-serif text-[1.55rem] leading-none">
                  {feature.title}
                </h3>
                <p className="mx-auto mt-3 max-w-[15rem] text-sm leading-6 text-black/62">
                  {feature.body}
                </p>
              </article>
            ))}
          </Reveal>
        </section>

        <section className="page-shell py-14 sm:py-18 lg:py-20">
          <div className="relative">
            <AdminSectionEditLink sectionKey={communitySection?.section_key || "curated-edits"} />
            <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow text-black/55">Community</p>
                <h2 className="mt-3 font-serif text-4xl leading-[0.96] sm:text-5xl">
                  Worn by women building their best selves.
                </h2>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/65">
                @elan.tn
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {communityImages.map((image) => (
                <AdminEditableImage
                  key={image.id}
                  itemId={image.itemId}
                  label={image.label}
                >
                  <Link href={image.href} aria-label={`Explore ${image.label}`}>
                    <ImagePlaceholder
                      label={image.label}
                      src={image.src}
                      alt={image.label}
                      ratio="square"
                      hoverZoom
                      className="aspect-[0.92] border border-black/10"
                    />
                  </Link>
                </AdminEditableImage>
              ))}
            </div>
          </div>
        </section>

        <div className="page-shell pb-14 sm:pb-18 lg:pb-20">
          <div className="relative border border-black/10 bg-[#ede5d8]">
            <AdminSectionEditLink sectionKey="newsletter" />
            <NewsletterBlock
              eyebrow={sectionTextIgnoringLegacy(
                newsletterSection,
                "eyebrow",
                "Newsletter",
                {
                  eyebrow: "Private notes from ÉLAN",
                  heading: "A considered inbox.",
                  body: "New arrivals, editorial stories, and private offers, sent with restraint.",
                },
              )}
              heading={sectionTextIgnoringLegacy(
                newsletterSection,
                "heading",
                "Join the ritual.",
                {
                  eyebrow: "Private notes from ÉLAN",
                  heading: "A considered inbox.",
                  body: "New arrivals, editorial stories, and private offers, sent with restraint.",
                },
              )}
              body={sectionTextIgnoringLegacy(
                newsletterSection,
                "body",
                "Get early access to new drops, exclusive offers, and inspiration for a life in motion.",
                {
                  eyebrow: "Private notes from ÉLAN",
                  heading: "A considered inbox.",
                  body: "New arrivals, editorial stories, and private offers, sent with restraint.",
                },
              )}
            />
          </div>
        </div>
      </main>
    </AdminStorefrontControlsProvider>
  );
}
