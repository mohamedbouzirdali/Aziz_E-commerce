import type { Metadata } from "next";
import Link from "next/link";
import {
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

export const metadata: Metadata = {
  title: "evoflex | Sport et lifestyle premium",
  description:
    "Des pièces premium de sport et de lifestyle pour les femmes qui construisent une vie de confiance, d’équilibre et de discipline.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "evoflex | Sport et lifestyle premium",
    description:
      "Des pièces premium de sport et de lifestyle pour les femmes qui construisent une vie de confiance, d’équilibre et de discipline.",
    url: "/",
  },
};

const heroFallbackImage = "/hero.png";

const lifestyleFallbackImage =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=82";

const communityFallbackImages = [
  "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=82",
];

const qualityFeatures = [
  {
    title: "Tissu doux",
    body: "Une sensation soyeuse avec une respirabilité pensée pour le mouvement.",
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
    title: "Coupe sculptante",
    body: "Conçue pour soutenir, lisser et accompagner chacun de vos gestes.",
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
    title: "Confort quotidien",
    body: "Léger, souple et imaginé pour être porté tous les jours.",
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
    title: "Pensé pour bouger avec vous",
    body: "Des détails maîtrisés pour chaque séance et chaque journée.",
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
  legacy: Record<"eyebrow" | "heading" | "body", string | string[]>,
) {
  const current = section?.[field];
  const legacyValue = legacy[field];
  const legacyValues = Array.isArray(legacyValue) ? legacyValue : [legacyValue];

  if (!current || legacyValues.includes(current)) {
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
    const rawLabel =
      item?.media?.altText ||
      item?.placeholder_label ||
      item?.title_override ||
      `Image communauté ${index + 1}`;
    const labelMap: Record<string, string> = {
      "Relaxed weekend styling": "Silhouette week-end décontractée",
      "Modern office tailoring": "Tailleur de bureau moderne",
      "Evening silhouettes": "Silhouettes du soir",
      "Soft tailoring details": "Détails de tailleur souple",
      "Travel capsule wardrobe": "Vestiaire capsule de voyage",
    };

    return {
      id: item?.id ?? `community-${index}`,
      itemId: item?.id,
      href: item?.cta_href || "/shop",
      label: labelMap[rawLabel] ?? rawLabel,
      src: item?.media?.url || communityFallbackImages[index],
    };
  });
}

export default async function HomePage() {
  const cmsSections = await getHomepageContent();
  const sectionMap = new Map(
    (cmsSections ?? []).map((section) => [section.section_key, section]),
  );

  const featuredSection = sectionMap.get("new-arrivals");
  const lifestyleSection = sectionMap.get("editorial-story");
  const communitySection =
    sectionMap.get("curated-edits") ?? sectionMap.get("categories");
  const newsletterSection = sectionMap.get("newsletter");

  const lifestyleItem = lifestyleSection?.items[0];
  const heroImages: EditorialHeroImage[] = [
    {
      label: "Campagne vestiaire sport premium",
      src: heroFallbackImage,
    },
  ];

  const featuredProducts = featuredHomepageProducts(featuredSection, 4);
  const communityImages = communityGalleryItems(communitySection?.items, 6);

  return (
    <AdminStorefrontControlsProvider>
      <div className="overflow-x-clip bg-[#fbf8f2] text-[#1e1e1e]">
        <div className="relative">
          <EditorialHero
            eyebrow="Vestiaire sport premium"
            heading="Bougez avec intention."
            body="Des pièces premium pour les femmes qui cultivent une vie de confiance, d’équilibre et de discipline."
            images={heroImages}
            primaryCta={{ href: "/shop?sort=newest", label: "Découvrir la collection" }}
            secondaryCta={{
              href: "#lifestyle",
              label: "Explorer l’univers",
            }}
          />
        </div>

        <section className="page-shell border-b border-black/10 py-12 sm:py-16">
          <Reveal className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
            <div className="max-w-xl">
              <p className="eyebrow text-black/55">Notre philosophie</p>
              <h2 className="mt-4 max-w-md font-serif text-4xl leading-[0.96] sm:text-5xl">
                Le mouvement est plus qu’un exercice.
              </h2>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-sm leading-7 text-black/70 sm:text-base">
                C’est une manière d’être présente à soi-même, dans le corps comme
                dans la vie. Nous créons des pièces qui soutiennent vos objectifs,
                élèvent votre routine et vous accompagnent à chaque étape.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:text-black/65"
              >
                En savoir plus sur evoflex <span aria-hidden>→</span>
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
                  "Collection phare",
                  {
                    eyebrow: ["Tout juste arrivé", "Just arrived", "Featured collection"],
                    heading: ["Nouvelles silhouettes", "New forms", "Elevated essentials for every move."],
                    body: "Seule une ligne resserrée de produits apparaît sur l’accueil. Le reste de la page reste guidé par l’image.",
                  },
                )}
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-[0.96] sm:text-5xl">
                {sectionTextIgnoringLegacy(
                  featuredSection,
                  "heading",
                  "Des essentiels raffinés pour chaque mouvement.",
                  {
                    eyebrow: ["Tout juste arrivé", "Just arrived", "Featured collection"],
                    heading: ["Nouvelles silhouettes", "New forms", "Elevated essentials for every move."],
                    body: "Seule une ligne resserrée de produits apparaît sur l’accueil. Le reste de la page reste guidé par l’image.",
                  },
                )}
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:text-black/65"
            >
              Tout voir <span aria-hidden>→</span>
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
          <div className="relative isolate">
            <Reveal className="grid overflow-hidden border border-black/10 bg-[#ede5d8] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-stretch">
              <ImagePlaceholder
                label={
                  lifestyleItem?.media?.altText ||
                  lifestyleItem?.placeholder_label ||
                  "Image éditoriale lifestyle"
                }
                src={lifestyleItem?.media?.url || lifestyleFallbackImage}
                alt={
                  lifestyleItem?.media?.altText ||
                  lifestyleItem?.placeholder_label ||
                  "Image éditoriale lifestyle"
                }
                ratio="landscape"
                className="h-full min-h-[300px] min-w-0 border-b border-black/10 lg:min-h-[460px] lg:border-b-0 lg:border-r"
              />
              <div className="flex min-w-0 flex-col justify-center px-6 py-10 sm:px-8 lg:px-12">
                <p className="eyebrow text-black/55">
                  {sectionTextIgnoringLegacy(
                    lifestyleSection,
                    "eyebrow",
                    "Univers",
                    {
                      eyebrow: ["Le journal · Étude 01", "The journal · Study 01", "Lifestyle"],
                      heading: ["L’architecture de l’aisance.", "The architecture of ease.", "More than activewear."],
                      body: [
                        "Un tailoring fluide et des bases nettes, conçus pour garder leur tenue tout en laissant de l’espace à la vôtre.",
                        "Fluid tailoring and clean foundations, designed to hold their shape while leaving space for yours.",
                        "We believe in balance — strong bodies, clear minds, and lives that feel aligned. evoflex is here to inspire the routines, rituals, and moments that make you feel your best.",
                      ],
                    },
                  )}
                </p>
                <h2 className="mt-4 max-w-md text-balance font-serif text-4xl leading-[0.96] sm:text-5xl">
                  {sectionTextIgnoringLegacy(
                    lifestyleSection,
                    "heading",
                    "Bien plus que le sport.",
                    {
                      eyebrow: ["Le journal · Étude 01", "The journal · Study 01", "Lifestyle"],
                      heading: ["L’architecture de l’aisance.", "The architecture of ease.", "More than activewear."],
                      body: [
                        "Un tailoring fluide et des bases nettes, conçus pour garder leur tenue tout en laissant de l’espace à la vôtre.",
                        "Fluid tailoring and clean foundations, designed to hold their shape while leaving space for yours.",
                        "We believe in balance — strong bodies, clear minds, and lives that feel aligned. evoflex is here to inspire the routines, rituals, and moments that make you feel your best.",
                      ],
                    },
                  )}
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-black/68">
                  {sectionTextIgnoringLegacy(
                    lifestyleSection,
                    "body",
                    "Nous croyons à l’équilibre — des corps forts, des esprits clairs et des vies alignées. evoflex est là pour inspirer les routines, les rituels et les moments où l’on se sent le mieux.",
                    {
                      eyebrow: ["Le journal · Étude 01", "The journal · Study 01", "Lifestyle"],
                      heading: ["L’architecture de l’aisance.", "The architecture of ease.", "More than activewear."],
                      body: [
                        "Un tailoring fluide et des bases nettes, conçus pour garder leur tenue tout en laissant de l’espace à la vôtre.",
                        "Fluid tailoring and clean foundations, designed to hold their shape while leaving space for yours.",
                        "We believe in balance — strong bodies, clear minds, and lives that feel aligned. evoflex is here to inspire the routines, rituals, and moments that make you feel your best.",
                      ],
                    },
                  )}
                </p>
                <Link
                  href="/about"
                  className="mt-8 inline-flex w-fit items-center gap-3 self-start bg-[#8d9684] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#75806b]"
                >
                  Explorer l’univers <span aria-hidden>→</span>
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
            <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow text-black/55">Communauté</p>
                <h2 className="mt-3 font-serif text-4xl leading-[0.96] sm:text-5xl">
                  Porté par des femmes qui cultivent le meilleur d’elles-mêmes.
                </h2>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/65">
                @evoflex
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {communityImages.map((image) => (
                <Link
                  key={image.id}
                  href={image.href}
                  aria-label={`Explorer ${image.label}`}
                >
                  <ImagePlaceholder
                    label={image.label}
                    src={image.src}
                    alt={image.label}
                    ratio="square"
                    hoverZoom
                    className="aspect-[0.92] border border-black/10"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="page-shell pb-14 sm:pb-18 lg:pb-20">
          <div className="relative border border-black/10 bg-[#ede5d8]">
            <NewsletterBlock
              eyebrow={sectionTextIgnoringLegacy(
                newsletterSection,
                "eyebrow",
                "Newsletter",
                {
                  eyebrow: ["Notes privées d’evoflex", "Notes privées d’ÉLAN", "Private notes from evoflex", "Private notes from ÉLAN", "Newsletter"],
                  heading: ["Une boîte mail réfléchie.", "A considered inbox.", "Join the ritual."],
                  body: [
                    "Nouveautés, récits éditoriaux et offres privées, envoyés avec mesure.",
                    "New arrivals, editorial stories, and private offers, sent with restraint.",
                    "Get early access to new drops, exclusive offers, and inspiration for a life in motion.",
                  ],
                },
              )}
              heading={sectionTextIgnoringLegacy(
                newsletterSection,
                "heading",
                "Rejoignez le rituel.",
                {
                  eyebrow: ["Notes privées d’evoflex", "Notes privées d’ÉLAN", "Private notes from evoflex", "Private notes from ÉLAN", "Newsletter"],
                  heading: ["Une boîte mail réfléchie.", "A considered inbox.", "Join the ritual."],
                  body: [
                    "Nouveautés, récits éditoriaux et offres privées, envoyés avec mesure.",
                    "New arrivals, editorial stories, and private offers, sent with restraint.",
                    "Get early access to new drops, exclusive offers, and inspiration for a life in motion.",
                  ],
                },
              )}
              body={sectionTextIgnoringLegacy(
                newsletterSection,
                "body",
                "Accédez en avant-première aux nouveaux lancements, aux offres exclusives et à l’inspiration d’une vie en mouvement.",
                {
                  eyebrow: ["Notes privées d’evoflex", "Notes privées d’ÉLAN", "Private notes from evoflex", "Private notes from ÉLAN", "Newsletter"],
                  heading: ["Une boîte mail réfléchie.", "A considered inbox.", "Join the ritual."],
                  body: [
                    "Nouveautés, récits éditoriaux et offres privées, envoyés avec mesure.",
                    "New arrivals, editorial stories, and private offers, sent with restraint.",
                    "Get early access to new drops, exclusive offers, and inspiration for a life in motion.",
                  ],
                },
              )}
            />
          </div>
        </div>
      </div>
    </AdminStorefrontControlsProvider>
  );
}
