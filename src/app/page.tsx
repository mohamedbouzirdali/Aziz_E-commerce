import type { Metadata } from "next";
import { BoxCard } from "@/components/cards/box-card";
import { CategoryTile } from "@/components/cards/category-tile";
import { ProductCard } from "@/components/cards/product-card";
import { Reveal } from "@/components/motion/reveal";
import { CuratedEditsSlider } from "@/components/sections/curated-edits-slider";
import { EditorialHero } from "@/components/sections/editorial-hero";
import { NewsletterBlock } from "@/components/sections/newsletter-block";
import { ServiceStrip } from "@/components/sections/service-strip";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { boxes, categories, products } from "@/data";
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

export default function HomePage() {
  return (
    <>
      <EditorialHero />

      <section className="page-shell py-16 lg:py-32">
        <Reveal className="mb-12 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end lg:mb-16">
          <div>
            <p className="eyebrow">Find your direction</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-none min-[390px]:text-5xl sm:text-6xl">
              A wardrobe,
              <br />
              <span className="italic">considered.</span>
            </h2>
          </div>
          <div className="max-w-xs sm:text-right">
            <p className="text-sm leading-6 text-charcoal">
              Explore by form, function, or the feeling you want to carry.
            </p>
            <Button href="/shop" variant="text" className="mt-5">View all categories</Button>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-y-12 min-[380px]:grid-cols-2 min-[380px]:gap-x-4 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-16">
          {categories.slice(0, 6).map((category) => (
            <div key={category.id} className="min-w-0">
              <CategoryTile category={category} />
            </div>
          ))}
        </div>
      </section>

      <CuratedEditsSlider />

      <section className="bg-off-white py-16 lg:py-28">
        <div className="page-shell">
          <Reveal className="mb-12 flex flex-col items-start gap-5 min-[390px]:flex-row min-[390px]:items-end min-[390px]:justify-between">
            <div>
              <p className="eyebrow">Just arrived</p>
              <h2 className="mt-3 font-serif text-4xl leading-none min-[390px]:text-5xl sm:text-6xl">New forms</h2>
            </div>
            <Button href="/shop?sort=newest" variant="text">Shop new in</Button>
          </Reveal>
          <div className="grid grid-cols-1 gap-y-12 min-[380px]:grid-cols-2 min-[380px]:gap-x-4 lg:grid-cols-4 lg:gap-x-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-16 lg:py-28">
        <div className="page-shell grid gap-0 lg:grid-cols-2 lg:items-stretch">
          <Reveal className="min-w-0" distance={30}>
            <ImagePlaceholder
              label="Architectural tailoring in motion"
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
              <p className="eyebrow text-white/50">The journal · Study 01</p>
              <h2 className="mt-5 font-serif text-4xl leading-[0.92] min-[390px]:text-5xl sm:text-6xl">
                The architecture
                <br />
                <span className="italic">of ease.</span>
              </h2>
              <p className="mt-7 max-w-md text-sm leading-7 text-white/68">
                Fluid tailoring and clean foundations, designed to hold their shape while leaving space for yours.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-6">
                <Button
                  href="/shop?collection=new-form"
                  className="border-white bg-white text-black before:bg-off-white"
                >
                  Shop the edit
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

      <section className="page-shell py-16 lg:py-32">
        <Reveal className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow">Curated capsules</p>
            <h2 className="mt-4 font-serif text-4xl leading-[0.95] min-[390px]:text-5xl sm:text-6xl">
              Complete
              <br />
              <span className="italic">the thought.</span>
            </h2>
          </div>
          <div className="max-w-xl lg:justify-self-end">
            <p className="text-sm leading-7 text-charcoal">
              Each box brings together complementary pieces at a considered price. A complete direction, with your size selected for every garment.
            </p>
            <Button href="/boxes" variant="text" className="mt-5">Discover all boxes</Button>
          </div>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-8 lg:mt-16 lg:grid-cols-2">
          {boxes.slice(0, 2).map((box) => (
            <BoxCard key={box.id} box={box} />
          ))}
        </div>
      </section>

      <ServiceStrip />
      <NewsletterBlock />
    </>
  );
}
