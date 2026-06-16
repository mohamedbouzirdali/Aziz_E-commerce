"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import { AdminEditableImage } from "@/components/admin/storefront-edit-controls";
import { Button } from "@/components/ui/button";
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
  {
    label: "Women fashion editorial campaign on warm court",
    src: "https://images.unsplash.com/photo-1599440681946-4ea0bc957b68?auto=format&fit=crop&w=2400&q=85",
  },
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
  const configuredHero = images[0];
  const heroImage = {
    ...defaultImages[0],
    ...configuredHero,
    src: configuredHero?.src || defaultImages[0].src,
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-black">
      <AdminEditableImage itemId={heroImage.itemId} label={heroImage.label}>
        <motion.div
          className="relative min-h-[520px] h-[78svh] max-h-[860px] w-full text-white sm:min-h-[620px] lg:h-[calc(100svh-4rem)]"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={imageMotion}
          custom={0.08}
        >
          {heroImage.src && (
            <Image
              src={heroImage.src}
              alt={heroImage.label}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.68)_0%,rgba(8,8,8,0.38)_38%,rgba(8,8,8,0.06)_74%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,8,0.34)_0%,rgba(8,8,8,0)_46%)]" />
          <div className="page-shell relative flex h-full items-center">
            <motion.div
              className="max-w-2xl pt-8"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.85,
                delay: reduceMotion ? 0 : 0.18,
                ease: premiumEase,
              }}
            >
              <p className="eyebrow text-white/70">{eyebrow}</p>
              <h1 className="mt-5 font-serif text-5xl leading-[0.9] min-[390px]:text-6xl sm:text-7xl lg:text-8xl">
                {heading}
              </h1>
              <p className="mt-6 max-w-md text-sm leading-7 text-white/78 sm:text-base">
                {body}
              </p>
              <div className="mt-8 flex flex-col gap-3 min-[390px]:flex-row min-[390px]:flex-wrap">
                <Button
                  href="/shop?sort=newest"
                  className="border-white bg-white text-black before:bg-off-white"
                >
                  Shop Collection
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
        </motion.div>
      </AdminEditableImage>
    </section>
  );
}
