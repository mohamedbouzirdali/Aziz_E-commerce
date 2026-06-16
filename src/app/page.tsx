import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminEditableImage,
  AdminSectionEditLink,
  AdminStorefrontControlsProvider,
} from "@/components/admin/storefront-edit-controls";
import { BoxCard } from "@/components/cards/box-card";
import { CategoryTile } from "@/components/cards/category-tile";
import { Reveal } from "@/components/motion/reveal";
import {
  CuratedEditsSlider,
  type CuratedEditItem,
} from "@/components/sections/curated-edits-slider";
import {
  EditorialHero,
  type EditorialHeroImage,
} from "@/components/sections/editorial-hero";
import { NewsletterBlock } from "@/components/sections/newsletter-block";
import {
  ShopByRhythm,
  type RhythmItem,
} from "@/components/sections/shop-by-rhythm";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { boxes, categories, products } from "@/data";
import { formatTnd } from "@/lib/format";
import {
  getHomepageContent,
  type HomepageContentItem,
  type HomepageContentSection,
} from "@/lib/homepage/content";
import { siteConfig } from "@/lib/seo";
import type { Category } from "@/lib/types";

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

const defaultSectionOrder = [
  "hero",
  "new-arrivals",
  "shop-by-rhythm",
  "categories",
  "editorial-story",
  "curated-edits",
  "boxes",
  "newsletter",
];

const fashionFallbackImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1506629905607-c52b1ea7d3f6?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=82",
];

const rhythmFallbackImages = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=82",
];

const curatedEditFallbackImages = [
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1506629905607-c52b1ea7d3f6?auto=format&fit=crop&w=1200&q=82",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=82",
];

const editorialStoryFallbackImage =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=82";

const hiddenHomepageSections = new Set(["best-sellers", "services"]);

function sectionText(
  section: HomepageContentSection | undefined,
  field: "eyebrow" | "heading" | "body",
  fallback: string,
) {
  return section?.[field] || fallback;
}

function heroSectionText(
  section: HomepageContentSection | undefined,
  field: "eyebrow" | "heading" | "body",
  fallback: string,
) {
  const current = section?.[field];
  const oldDefaults: Record<"eyebrow" | "heading" | "body", string> = {
    eyebrow: "New collection · Made to move",
    heading: "Ease, in motion.",
    body: "Premium everyday pieces designed around movement, clean proportion, and quiet confidence.",
  };

  if (!current || current === oldDefaults[field]) return fallback;
  return current;
}

function selectedProductsSectionText(
  section: HomepageContentSection | undefined,
  field: "eyebrow" | "heading" | "body",
  fallback: string,
) {
  const current = section?.[field];
  const oldDefaults: Record<"eyebrow" | "heading" | "body", string> = {
    eyebrow: "Just arrived",
    heading: "New forms",
    body: "Only a focused row of products lives on the homepage. The rest of the page keeps the brand image-led.",
  };

  if (!current || current === oldDefaults[field]) return fallback;
  return current;
}

function editorialImage(item: HomepageContentItem): EditorialHeroImage {
  return {
    label:
      item.media?.altText ||
      item.placeholder_label ||
      item.title_override ||
      "ÉLAN editorial image",
    src: item.media?.url,
    itemId: item.id,
  };
}

function itemHref(item: HomepageContentItem, fallback = "/shop") {
  return item.cta_href || fallback;
}

function categorySlug(item: HomepageContentItem, index: number) {
  const match = item.cta_href?.match(/[?&]category=([^&]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : categories[index]?.slug;
}

function withAdminControl(
  sectionKey: string,
  content: React.ReactNode,
  className = "relative",
) {
  return (
    <div key={sectionKey} className={className}>
      <AdminSectionEditLink sectionKey={sectionKey} />
      {content}
    </div>
  );
}

function homepageSectionOrder(cmsSections: HomepageContentSection[] | null) {
  if (!cmsSections) return defaultSectionOrder;

  const visibleKeys = new Set(
    cmsSections
      .map((section) => section.section_key)
      .filter((key) => !hiddenHomepageSections.has(key)),
  );
  const knownKeys = defaultSectionOrder.filter((key) => visibleKeys.has(key));
  const extraKeys = cmsSections
    .map((section) => section.section_key)
    .filter(
      (key) =>
        !hiddenHomepageSections.has(key) && !defaultSectionOrder.includes(key),
    );

  return [...knownKeys, ...extraKeys];
}

function featuredHomepageProducts(
  section: HomepageContentSection | undefined,
  desiredCount = 8,
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

function imageWithFallback(
  imageUrl: string | undefined,
  fallback: string,
) {
  return imageUrl || fallback;
}
function Button({
  href,
  children,
  className = "",
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const classes = [
    "relative inline-flex min-h-11 cursor-pointer items-center justify-center overflow-hidden border px-6 text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-40",
    "before:absolute before:inset-0 before:origin-right before:scale-x-0 before:transition-transform before:duration-500 hover:before:origin-left hover:before:scale-x-100",
    className,
  ].join(" ");

  const content = <span className="relative z-10">{children}</span>;

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes}>
      {content}
    </button>
  );
}
export default async function HomePage() {
  const cmsSections = await getHomepageContent();
  const sectionMap = new Map(
    (cmsSections ?? []).map((section) => [section.section_key, section]),
  );
  const sectionOrder = homepageSectionOrder(cmsSections);

  function renderSection(sectionKey: string) {
    const section = sectionMap.get(sectionKey);

    switch (sectionKey) {
      case "hero": {
        const images = section?.items.map(editorialImage);
        return withAdminControl(
          sectionKey,
          <EditorialHero
            eyebrow={heroSectionText(
              section,
              "eyebrow",
              "New collection",
            )}
            heading={heroSectionText(section, "heading", "Move with intention.")}
            body={heroSectionText(
              section,
              "body",
              "Premium womenswear shaped for confidence, balance, and everyday discipline.",
            )}
            images={images?.length ? images : undefined}
          />,
        );
      }

      case "shop-by-rhythm": {
        const items: RhythmItem[] | undefined = section?.items.map(
          (item, index) => ({
            number: String(index + 1).padStart(2, "0"),
            moment:
              typeof item.settings === "object" &&
              item.settings !== null &&
              !Array.isArray(item.settings) &&
              typeof item.settings.moment === "string"
                ? item.settings.moment
                : "ÉLAN edit",
            title:
              item.title_override ||
              item.productName ||
              item.boxName ||
              `Edit ${index + 1}`,
            description:
              item.body_override || "A considered direction for the day.",
            label:
              item.media?.altText ||
              item.placeholder_label ||
              "Editorial styling",
            href: itemHref(item),
            cta: item.cta_label || "Explore edit",
            note:
              typeof item.settings === "object" &&
              item.settings !== null &&
              !Array.isArray(item.settings) &&
              typeof item.settings.note === "string"
                ? item.settings.note
                : "Considered dressing",
            imageUrl: imageWithFallback(
              item.media?.url,
              rhythmFallbackImages[index % rhythmFallbackImages.length],
            ),
            itemId: item.id,
          }),
        );

        return withAdminControl(
          sectionKey,
          <ShopByRhythm
            eyebrow={sectionText(
              section,
              "eyebrow",
              "The ÉLAN edits · Shop by rhythm",
            )}
            heading={sectionText(
              section,
              "heading",
              "A wardrobe for every movement.",
            )}
            body={sectionText(
              section,
              "body",
              "Four considered directions for the pace, purpose, and atmosphere of your day.",
            )}
            items={items}
          />,
        );
      }

      case "categories": {
        const cmsCategories: Category[] | undefined = section
          ? section.items.flatMap((item, index): Category[] => {
              const slug = categorySlug(item, index);
              if (!slug) return [];
              return [
                {
                  id: item.id,
                  slug,
                  name: item.title_override || categories[index]?.name || slug,
                  description:
                    item.body_override ||
                    categories[index]?.description ||
                    "Explore the edit.",
                  placeholderImageLabel:
                    item.media?.altText ||
                    item.placeholder_label ||
                    `${slug} editorial`,
                  imageUrl: imageWithFallback(
                    item.media?.url,
                    categories[index]?.imageUrl ||
                      fashionFallbackImages[index % fashionFallbackImages.length],
                  ),
                },
              ];
            })
          : undefined;
        const displayCategories = cmsCategories ?? categories.slice(0, 6);
        const featuredCategories = displayCategories.slice(0, 3);
        const remainingCategories = displayCategories.slice(3);

        return (
          <section
            key={sectionKey}
            className="page-shell relative bg-off-white pb-16 pt-6 lg:pb-20 lg:pt-8"
          >
            <AdminSectionEditLink sectionKey={sectionKey} />
            <Reveal className="grid gap-7 border-t border-black/10 pt-10 sm:grid-cols-2 sm:items-start lg:pt-12">
              <div className="max-w-xl">
                <p className="eyebrow">
                  {sectionText(section, "eyebrow", "Find your direction")}
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-[0.92] min-[390px]:text-5xl sm:text-6xl">
                  {sectionText(section, "heading", "A wardrobe, considered.")}
                </h2>
                <p className="mt-6 text-sm leading-7 text-charcoal">
                  {sectionText(
                    section,
                    "body",
                    "A homepage led by atmosphere first, then by the few categories that define the collection most clearly.",
                  )}
                </p>
              </div>
              <div className="grid gap-5 sm:justify-items-end">
                <div className="max-w-sm sm:text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                    Everyday clarity
                  </p>
                  <p className="mt-3 text-sm leading-7 text-charcoal/75">
                    Defined by clean categories, but presented with the breathing
                    room of an editorial front page.
                  </p>
                </div>
                <Button href="/shop" variant="text">
                  View all categories
                </Button>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-8 lg:grid-cols-3 lg:gap-6">
              {featuredCategories.map((category, index) => (
                <div key={category.id} className="min-w-0">
                  <CategoryTile
                    category={category}
                    homepageItemId={section?.items[index]?.id}
                  />
                </div>
              ))}
            </div>

            {remainingCategories.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-border pt-6">
                {remainingCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop?category=${category.slug}`}
                    className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/65 transition-colors hover:text-black"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </section>
        );
      }

      case "curated-edits": {
        const items: CuratedEditItem[] | undefined = section?.items.map(
          (item, index) => ({
            title: item.title_override || `Edit ${index + 1}`,
            text:
              item.body_override || "A considered wardrobe for the moment.",
            label:
              item.media?.altText ||
              item.placeholder_label ||
              "Editorial styling",
            href: itemHref(item),
            cta: item.cta_label || "Explore edit",
            imageUrl: imageWithFallback(
              item.media?.url,
              curatedEditFallbackImages[index % curatedEditFallbackImages.length],
            ),
            itemId: item.id,
          }),
        );

        return withAdminControl(
          sectionKey,
          <CuratedEditsSlider
            eyebrow={sectionText(section, "eyebrow", "For every moment")}
            heading={sectionText(
              section,
              "heading",
              "Dress with intention.",
            )}
            body={sectionText(
              section,
              "body",
              "Glide left or right to explore considered edits for work, travel, evenings, and unhurried weekends.",
            )}
            items={items}
          />,
        );
      }

      case "new-arrivals": {
        const selectedProducts = featuredHomepageProducts(section);

        return (
          <section
            key={sectionKey}
            id="new-arrivals"
            className="relative overflow-hidden bg-off-white pb-12 pt-14 lg:pb-14 lg:pt-20"
          >
            <AdminSectionEditLink sectionKey={sectionKey} />
            <div className="page-shell">
              <Reveal className="mx-auto max-w-2xl text-center">
                <div>
                  <p className="eyebrow">
                    {selectedProductsSectionText(
                      section,
                      "eyebrow",
                      "Shop the collection",
                    )}
                  </p>
                  <h2 className="mt-3 font-serif text-4xl leading-[0.95] min-[390px]:text-5xl sm:text-6xl">
                    {selectedProductsSectionText(
                      section,
                      "heading",
                      "Elevated essentials for every move.",
                    )}
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-charcoal">
                    {selectedProductsSectionText(
                      section,
                      "body",
                      "A broader edit of selected pieces, presented with image-first focus and enough range to feel like a real collection.",
                    )}
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="mt-10 flex snap-x snap-proximity gap-3 overflow-x-auto px-[max(1rem,calc((100vw-80rem)/2+1.5rem))] pb-4 scroll-smooth [scrollbar-width:none] [touch-action:pan-x_pan-y] sm:gap-4 sm:px-[max(1.25rem,calc((100vw-80rem)/2+2.25rem))] lg:gap-5 [&::-webkit-scrollbar]:hidden">
              {selectedProducts.map((product, index) => {
                const color =
                  product.colors.find(
                    (item) => item.id === product.defaultColor,
                  ) ?? product.colors[0];
                const imageSrc =
                  fashionFallbackImages[index % fashionFallbackImages.length];

                return (
                  <article
                    key={product.id}
                    className="group w-[70vw] min-w-[70vw] max-w-[320px] shrink-0 snap-start bg-white min-[390px]:w-[64vw] min-[390px]:min-w-[64vw] sm:w-[35vw] sm:min-w-[35vw] lg:w-[22vw] lg:min-w-[22vw] xl:w-[18vw] xl:min-w-[18vw]"
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      className="block"
                      aria-label={`View ${product.name}`}
                    >
                      <ImagePlaceholder
                        label={
                          color?.imagePlaceholderLabel ??
                          product.placeholderImageLabel
                        }
                        src={imageSrc}
                        alt={
                          color?.imagePlaceholderLabel ??
                          product.placeholderImageLabel
                        }
                        ratio="portrait"
                        className="aspect-[4/5]"
                        hoverZoom
                      />
                    </Link>
                    <div className="grid min-h-[102px] gap-3 border-b border-border px-3 py-3.5 sm:grid-cols-[1fr_auto] sm:px-3.5 sm:py-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-xs font-semibold sm:text-sm">
                          <Link
                            href={`/product/${product.slug}`}
                            className="link-underline"
                          >
                            {product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-[10px] capitalize tracking-[0.04em] text-charcoal/55">
                          {color?.name ?? "Editorial"} edit
                        </p>
                      </div>
                      <p className="text-xs font-medium sm:text-right">
                        {formatTnd(product.priceTnd)}
                      </p>
                      <div className="col-span-full flex items-center gap-2">
                        {product.colors.slice(0, 3).map((swatch) => (
                          <span
                            key={swatch.id}
                            className="size-3.5 border border-black/15"
                            style={{ backgroundColor: swatch.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      }

      case "best-sellers": {
        const editorialItems =
          section?.items.map((item, index) => ({
            id: item.id,
            title:
              item.title_override ||
              item.productName ||
              `Editorial study ${index + 1}`,
            text:
              item.body_override ||
              "A quieter image-led moment between shopping sections.",
            href: itemHref(item, "/shop"),
            cta: item.cta_label || "Explore",
            label:
              item.media?.altText ||
              item.placeholder_label ||
              item.productName ||
              `Editorial image ${index + 1}`,
            imageUrl: item.media?.url,
          })) ?? [
            {
              id: "fallback-story-1",
              title: "Soft structure",
              text: "Modern tailoring shown with more space and less noise.",
              href: "/shop?category=tailoring",
              cta: "Shop tailoring",
              label: "Soft structure editorial image",
              imageUrl: undefined,
            },
            {
              id: "fallback-story-2",
              title: "Quiet foundations",
              text: "Pieces that hold a wardrobe together without overstatement.",
              href: "/shop?category=tops",
              cta: "Shop tops",
              label: "Quiet foundations editorial image",
              imageUrl: undefined,
            },
            {
              id: "fallback-story-3",
              title: "After hours",
              text: "Evening direction without visual excess.",
              href: "/shop?collection=after-dark",
              cta: "Shop evening",
              label: "After hours editorial image",
              imageUrl: undefined,
            },
          ];

        return (
          <section
            key={sectionKey}
            className="relative border-y border-border bg-white py-16 lg:py-24"
          >
            <AdminSectionEditLink sectionKey={sectionKey} />
            <div className="page-shell grid gap-8 lg:grid-cols-[0.44fr_0.56fr] lg:gap-10">
              <Reveal className="flex flex-col justify-between border border-border bg-off-white p-6 sm:p-8 lg:min-h-[43rem] lg:p-10">
                <div>
                  <p className="eyebrow">
                    {sectionText(section, "eyebrow", "The ÉLAN perspective")}
                  </p>
                  <h2 className="mt-4 font-serif text-4xl leading-[0.92] min-[390px]:text-5xl sm:text-6xl">
                    {sectionText(section, "heading", "More image, less noise.")}
                  </h2>
                  <p className="mt-6 max-w-md text-sm leading-7 text-charcoal">
                    {sectionText(
                      section,
                      "body",
                      "The homepage should feel like a campaign front page that still knows how to sell. Imagery leads. Commerce appears only where it matters.",
                    )}
                  </p>
                </div>
                <div className="mt-8 border-t border-border pt-5">
                  <Button href="/about" variant="text">
                    Read the brand story
                  </Button>
                </div>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {editorialItems.slice(0, 3).map((item, index) => (
                  <Reveal
                    key={item.id}
                    className={index === 0 ? "sm:col-span-2" : ""}
                    delay={index * 0.06}
                  >
                    <article className="group h-full">
                      <AdminEditableImage itemId={item.id} label={item.label}>
                        <Link href={item.href} className="block">
                          <ImagePlaceholder
                            label={item.label}
                            src={item.imageUrl}
                            alt={item.label}
                            ratio={index === 0 ? "landscape" : "portrait"}
                            className={
                              index === 0
                                ? "aspect-[16/9] min-h-[290px] lg:min-h-[360px]"
                                : "min-h-[320px]"
                            }
                            hoverZoom
                          />
                        </Link>
                      </AdminEditableImage>
                      <Link
                        href={item.href}
                        className="block border-b border-border py-4 transition-[padding] duration-300 group-hover:px-2"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-serif text-3xl leading-none">
                              {item.title}
                            </h3>
                            <p className="mt-3 max-w-md text-xs leading-6 text-charcoal/72">
                              {item.text}
                            </p>
                          </div>
                          <span
                            aria-hidden
                            className="pt-1 text-base transition-transform duration-300 group-hover:translate-x-1.5"
                          >
                            →
                          </span>
                        </div>
                        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/75">
                          {item.cta}
                        </p>
                      </Link>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      }

      case "editorial-story": {
        const image = section?.items[0]
          ? {
              ...editorialImage(section.items[0]),
              src: imageWithFallback(
                section.items[0].media?.url,
                editorialStoryFallbackImage,
              ),
            }
          : {
              label: "Architectural tailoring in motion",
              src: editorialStoryFallbackImage,
            };
        const storyCta = section?.items[0];

        return (
          <section
            key={sectionKey}
            className="relative bg-off-white py-12 lg:py-20"
          >
            <AdminSectionEditLink sectionKey={sectionKey} />
            <div className="page-shell grid gap-0 lg:grid-cols-2 lg:items-stretch">
              <Reveal className="min-w-0" distance={30}>
                <AdminEditableImage
                  itemId={storyCta?.id}
                  label={image.label}
                  className="h-full"
                >
                  <ImagePlaceholder
                    label={image.label}
                    src={image.src}
                    alt={image.label}
                    ratio="portrait"
                    className="h-full min-h-[380px] min-[390px]:min-h-[460px] lg:min-h-[620px]"
                    hoverZoom
                  />
                </AdminEditableImage>
              </Reveal>

              <Reveal
                className="flex items-center bg-black px-5 py-12 text-white min-[390px]:px-7 sm:px-12 lg:min-h-[620px] lg:px-16 lg:py-20"
                delay={0.12}
              >
                <div>
                  <p className="eyebrow text-white/50">
                    {sectionText(
                      section,
                      "eyebrow",
                      "The journal · Study 01",
                    )}
                  </p>
                  <h2 className="mt-5 font-serif text-4xl leading-[0.92] min-[390px]:text-5xl sm:text-6xl">
                    {sectionText(
                      section,
                      "heading",
                      "The architecture of ease.",
                    )}
                  </h2>
                  <p className="mt-7 max-w-md text-sm leading-7 text-white/68">
                    {sectionText(
                      section,
                      "body",
                      "Fluid tailoring and clean foundations, designed to hold their shape while leaving space for yours.",
                    )}
                  </p>
                  <div className="mt-9 flex flex-wrap items-center gap-6">
                    <Button
                      href={storyCta ? itemHref(storyCta) : "/shop?collection=new-form"}
                     className="!border-white !bg-white !text-black before:!bg-black hover:!bg-black hover:!text-white [&_*]:!text-black hover:[&_*]:!text-white"
                    >
                      {storyCta?.cta_label || "Shop the edit"}
                    </Button>
                    <a
                      href="/about"
                      className="link-underline text-[10px] font-semibold uppercase tracking-[0.16em]"
                    >
                      Read the story
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        );
      }

      case "boxes": {
        const selectedBoxes = section
          ? section.items.flatMap((item, index) => {
                const box = boxes.find((entry) => entry.slug === item.boxSlug);
                if (!box) return [];
                return [{
                  ...box,
                  imageUrl: imageWithFallback(
                    item.media?.url,
                    box.imageUrl ||
                      fashionFallbackImages[index % fashionFallbackImages.length],
                  ),
                }];
              })
          : boxes.slice(0, 2);

        return (
          <section
            key={sectionKey}
            className="page-shell relative border-t border-black/10 py-16 lg:py-24"
          >
            <AdminSectionEditLink sectionKey={sectionKey} />
            <Reveal className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="eyebrow">
                  {sectionText(section, "eyebrow", "Curated capsules")}
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-[0.95] min-[390px]:text-5xl sm:text-6xl">
                  {sectionText(
                    section,
                    "heading",
                    "Complete the thought.",
                  )}
                </h2>
              </div>
              <div className="max-w-xl lg:justify-self-end">
                <p className="text-sm leading-7 text-charcoal">
                  {sectionText(
                    section,
                    "body",
                    "Each box brings together complementary pieces at a considered price. A complete direction, with your size selected for every garment.",
                  )}
                </p>
                <Button href="/boxes" variant="text" className="mt-5">
                  Discover all boxes
                </Button>
              </div>
            </Reveal>

            <div className="mt-12 grid items-stretch gap-8 lg:mt-16 lg:grid-cols-2">
              {selectedBoxes.map((box) => (
                <BoxCard key={box.id} box={box} />
              ))}
            </div>
          </section>
        );
      }

      case "services":
        return null;

      case "newsletter":
        return withAdminControl(
          sectionKey,
          <NewsletterBlock
            eyebrow={sectionText(
              section,
              "eyebrow",
              "Private notes from ÉLAN",
            )}
            heading={sectionText(
              section,
              "heading",
              "A considered inbox.",
            )}
            body={section?.body ?? undefined}
          />,
        );

      default:
        return null;
    }
  }

  return (
    <AdminStorefrontControlsProvider>
      {sectionOrder.map(renderSection)}
    </AdminStorefrontControlsProvider>
  );
}
