import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminEditableImage,
  AdminSectionEditLink,
  AdminStorefrontControlsProvider,
} from "@/components/admin/storefront-edit-controls";
import { BoxCard } from "@/components/cards/box-card";
import { CategoryTile } from "@/components/cards/category-tile";
import { ProductCard } from "@/components/cards/product-card";
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
import { ServiceStrip } from "@/components/sections/service-strip";
import {
  ShopByRhythm,
  type RhythmItem,
} from "@/components/sections/shop-by-rhythm";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { boxes, categories, products } from "@/data";
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
  "shop-by-rhythm",
  "categories",
  "curated-edits",
  "new-arrivals",
  "best-sellers",
  "editorial-story",
  "boxes",
  "services",
  "newsletter",
];

function sectionText(
  section: HomepageContentSection | undefined,
  field: "eyebrow" | "heading" | "body",
  fallback: string,
) {
  return section?.[field] || fallback;
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

export default async function HomePage() {
  const cmsSections = await getHomepageContent();
  const sectionMap = new Map(
    (cmsSections ?? []).map((section) => [section.section_key, section]),
  );
  const sectionOrder = cmsSections
    ? cmsSections.map((section) => section.section_key)
    : defaultSectionOrder;

  function renderSection(sectionKey: string) {
    const section = sectionMap.get(sectionKey);

    switch (sectionKey) {
      case "hero": {
        const images = section?.items.map(editorialImage);
        return withAdminControl(
          sectionKey,
          <EditorialHero
            eyebrow={sectionText(
              section,
              "eyebrow",
              "New collection · Made to move",
            )}
            heading={sectionText(section, "heading", "Ease, in motion.")}
            body={sectionText(
              section,
              "body",
              "Premium everyday pieces designed around movement, clean proportion, and quiet confidence.",
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
            imageUrl: item.media?.url,
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
                  ...(item.media?.url ? { imageUrl: item.media.url } : {}),
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
            className="page-shell relative py-16 lg:py-24"
          >
            <AdminSectionEditLink sectionKey={sectionKey} />
            <Reveal className="grid gap-7 border-b border-border pb-10 sm:grid-cols-2 sm:items-start lg:pb-12">
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
            imageUrl: item.media?.url,
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
        const selectedProducts = section
          ? section.items
              .map((item) =>
                products.find((product) => product.slug === item.productSlug),
              )
              .filter((product): product is (typeof products)[number] =>
                Boolean(product),
              )
              .slice(0, 5)
          : products.slice(0, 5);

        return (
          <section
            key={sectionKey}
            id="new-arrivals"
            className="relative overflow-hidden border-y border-border bg-off-white py-16 lg:py-24"
          >
            <AdminSectionEditLink sectionKey={sectionKey} />
            <div className="page-shell">
              <Reveal className="grid gap-7 border-b border-border pb-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end lg:pb-12">
                <div>
                  <p className="eyebrow">
                    {sectionText(section, "eyebrow", "Just arrived")}
                  </p>
                  <h2 className="mt-3 font-serif text-4xl leading-[0.92] min-[390px]:text-5xl sm:text-6xl">
                    {sectionText(section, "heading", "Selected pieces")}
                  </h2>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
                    {sectionText(
                      section,
                      "body",
                      "Only a focused row of products lives on the homepage. The rest of the page keeps the brand image-led.",
                    )}
                  </p>
                </div>
                <Button href="/shop?sort=newest" variant="text">
                  Shop new in
                </Button>
              </Reveal>

              <div className="mt-10 -mr-5 flex snap-x snap-proximity gap-4 overflow-x-auto pb-4 pr-5 [scrollbar-width:none] sm:gap-5 lg:gap-6 [&::-webkit-scrollbar]:hidden">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="w-[82vw] max-w-[350px] shrink-0 snap-start sm:w-[44vw] lg:w-[23rem]"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
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
          ? editorialImage(section.items[0])
          : { label: "Architectural tailoring in motion" };
        const storyCta = section?.items[0];

        return (
          <section
            key={sectionKey}
            className="relative border-y border-border bg-white py-16 lg:py-28"
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
                      className="border-white bg-white text-black before:bg-off-white"
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
          ? section.items
              .map((item) =>
                boxes.find((box) => box.slug === item.boxSlug),
              )
              .filter((box): box is (typeof boxes)[number] => Boolean(box))
          : boxes.slice(0, 2);

        return (
          <section
            key={sectionKey}
            className="page-shell relative py-16 lg:py-32"
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
        return withAdminControl(sectionKey, <ServiceStrip />);

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
