"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { AdminEditableImage } from "@/components/admin/storefront-edit-controls";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { premiumEase } from "@/lib/motion";

const imageMotion: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, delay, ease: premiumEase },
  }),
};

export type EditorialHeroImage = {
  label: string;
  src?: string;
  itemId?: string;
};

const defaultImages: EditorialHeroImage[] = [
  { label: "Primary campaign banner" },
  { label: "Editorial detail portrait" },
  { label: "Editorial movement portrait" },
];

export function EditorialHero({
  eyebrow = "New collection · Made to move",
  heading = "Ease, in motion.",
  body = "Premium everyday pieces designed around movement, clean proportion, and quiet confidence.",
  images = defaultImages,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  images?: EditorialHeroImage[];
}) {
  const reduceMotion = useReducedMotion();
  const heroImages = [...images, ...defaultImages].slice(0, 3);

  return (
    <section className="relative overflow-hidden border-b border-border bg-off-white">
      <div className="page-shell py-5 sm:py-6 lg:py-8">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-5">
          <motion.div
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            variants={imageMotion}
            custom={0.08}
          >
            <AdminEditableImage
              itemId={heroImages[0].itemId}
              label={heroImages[0].label}
            >
              <div className="group relative isolate overflow-hidden bg-black text-white">
                <ImagePlaceholder
                  label={heroImages[0].label}
                  src={heroImages[0].src}
                  alt={heroImages[0].label}
                  ratio="landscape"
                  className="min-h-[440px] aspect-[16/10] sm:min-h-[540px] lg:min-h-[700px] lg:aspect-[16/8]"
                  hoverZoom
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,12,12,0.62)_0%,rgba(12,12,12,0.28)_36%,rgba(12,12,12,0.06)_68%,rgba(12,12,12,0.04)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 top-0 flex items-end">
                  <motion.div
                    className="w-full max-w-xl px-5 pb-7 sm:px-8 sm:pb-9 lg:px-12 lg:pb-12"
                    initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.85,
                      delay: reduceMotion ? 0 : 0.22,
                      ease: premiumEase,
                    }}
                  >
                    <p className="eyebrow text-white/65">{eyebrow}</p>
                    <h1 className="mt-4 font-serif text-[clamp(3rem,8vw,6.6rem)] leading-[0.86] tracking-[-0.045em]">
                      {heading}
                    </h1>
                    <p className="mt-5 max-w-md text-sm leading-7 text-white/78 sm:text-base">
                      {body}
                    </p>
                    <div className="mt-7 flex flex-col gap-3 min-[390px]:flex-row min-[390px]:flex-wrap">
                      <Button
                        href="/shop?sort=newest"
                        className="border-white bg-white text-black before:bg-off-white"
                      >
                        Shop New In
                      </Button>
                      <Button
                        href="/boxes"
                        variant="secondary"
                        className="border-white bg-transparent text-white before:bg-white hover:text-black"
                      >
                        Explore Boxes
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </AdminEditableImage>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:grid-rows-2">
            {heroImages.slice(1).map((image, index) => (
              <motion.div
                key={image.itemId ?? image.label}
                initial={reduceMotion ? false : "hidden"}
                animate="visible"
                variants={imageMotion}
                custom={0.18 + index * 0.12}
              >
                <AdminEditableImage itemId={image.itemId} label={image.label}>
                  <ImagePlaceholder
                    label={image.label}
                    src={image.src}
                    alt={image.label}
                    ratio="portrait"
                    className="aspect-[5/6] h-full min-h-[210px] lg:min-h-[338px]"
                    hoverZoom
                  />
                </AdminEditableImage>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-5 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.65,
            delay: reduceMotion ? 0 : 0.55,
            ease: premiumEase,
          }}
        >
          <p className="max-w-xl text-xs leading-6 text-charcoal/75">
            A homepage led by campaign imagery, with selected pieces surfaced only
            where they sharpen the story.
          </p>
          <a
            href="#new-arrivals"
            className="group flex items-center gap-3 self-start text-[10px] font-semibold uppercase tracking-[0.18em]"
          >
            View selected pieces
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            >
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
