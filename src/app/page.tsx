import type { Metadata } from "next";
import {
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

        return (
          <section
            key={sectionKey}
            className="page-shell relative py-16 lg:py-28"
          >
            <AdminSectionEditLink sectionKey={sectionKey} />
            <Reveal className="mb-12 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end lg:mb-16">
              <div>
                <p className="eyebrow">
                  {sectionText(section, "eyebrow", "Find your direction")}
                </p>
                <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-none min-[390px]:text-5xl sm:text-6xl">
                  {sectionText(section, "heading", "A wardrobe, considered.")}
                </h2>
              </div>
              <div className="max-w-xs sm:text-right">
                <p className="text-sm leading-6 text-charcoal">
                  {sectionText(
                    section,
                    "body",
                    "Explore by form, function, or the feeling you want to carry.",
                  )}
                </p>
                <Button href="/shop" variant="text" className="mt-5">
                  View all categories
                </Button>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-y-12 min-[380px]:grid-cols-2 min-[380px]:gap-x-4 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-16">
              {displayCategories.map((category) => (
                <div key={category.id} className="min-w-0">
                  <CategoryTile category={category} />
                </div>
              ))}
            </div>
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
          : products.slice(0, 4);

        return (
          <section
            key={sectionKey}
            className="relative bg-off-white py-16 lg:py-28"
          >
            <AdminSectionEditLink sectionKey={sectionKey} />
            <div className="page-shell">
              <Reveal className="mb-12 flex flex-col items-start gap-5 min-[390px]:flex-row min-[390px]:items-end min-[390px]:justify-between">
                <div>
                  <p className="eyebrow">
                    {sectionText(section, "eyebrow", "Just arrived")}
                  </p>
                  <h2 className="mt-3 font-serif text-4xl leading-none min-[390px]:text-5xl sm:text-6xl">
                    {sectionText(section, "heading", "New forms")}
                  </h2>
                </div>
                <Button href="/shop?sort=newest" variant="text">
                  Shop new in
                </Button>
              </Reveal>
              <div className="grid grid-cols-1 gap-y-12 min-[380px]:grid-cols-2 min-[380px]:gap-x-4 lg:grid-cols-4 lg:gap-x-6">
                {selectedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        );
      }

      case "best-sellers": {
        const selectedProducts = section
          ? section.items
              .map((item) =>
                products.find((product) => product.slug === item.productSlug),
              )
              .filter((product): product is (typeof products)[number] =>
                Boolean(product),
              )
          : products.filter((product) => product.isBestSeller);

        return (
          <section
            key={sectionKey}
            className="page-shell relative py-16 lg:py-28"
          >
            <AdminSectionEditLink sectionKey={sectionKey} />
            <Reveal className="mb-10 flex flex-col items-start gap-5 min-[390px]:flex-row min-[390px]:items-end min-[390px]:justify-between lg:mb-14">
              <div>
                <p className="eyebrow">
                  {sectionText(section, "eyebrow", "Most considered")}
                </p>
                <h2 className="mt-3 font-serif text-4xl leading-none min-[390px]:text-5xl sm:text-6xl">
                  {sectionText(section, "heading", "Best sellers")}
                </h2>
              </div>
              <div className="max-w-sm min-[390px]:text-right">
                <p className="text-sm leading-6 text-charcoal">
                  {sectionText(
                    section,
                    "body",
                    "A focused selection chosen for proportion, versatility, and repeat wear.",
                  )}
                </p>
                <Button
                  href="/shop?availability=best-seller"
                  variant="text"
                  className="mt-4"
                >
                  Shop best sellers
                </Button>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-y-12 min-[380px]:grid-cols-2 min-[380px]:gap-x-4 lg:grid-cols-3 lg:gap-x-6">
              {selectedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
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
                <ImagePlaceholder
                  label={image.label}
                  src={image.src}
                  alt={image.label}
                  ratio="portrait"
                  className="h-full min-h-[380px] min-[390px]:min-h-[460px] lg:min-h-[620px]"
                  hoverZoom
                />
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
