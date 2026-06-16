"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
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
    label: "Campagne vestiaire sport premium",
    src: "/hero.png",
  },
];

export function EditorialHero({
  eyebrow = "Vestiaire sport premium",
  heading = "Bougez avec intention.",
  body = "Des pièces premium pour les femmes qui cultivent une vie de confiance, d’équilibre et de discipline.",
  images = defaultImages,
  primaryCta = { href: "/shop?sort=newest", label: "Découvrir la collection" },
  secondaryCta = { href: "#lifestyle", label: "Explorer l’univers" },
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  images?: EditorialHeroImage[];
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
}) {
  const reduceMotion = useReducedMotion();
  const configuredHero = images[0];
  const heroImage = {
    ...defaultImages[0],
    ...configuredHero,
    src: configuredHero?.src || defaultImages[0].src,
  };

  return (
    <section className="relative overflow-hidden border-b border-black/10 bg-[#f8f5ef]">
      <motion.div
        className="relative h-[74svh] min-h-[620px] max-h-[940px] w-full sm:min-h-[700px] lg:h-[calc(100svh-4rem)]"
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
            className="object-cover object-[66%_center] sm:object-[68%_center]"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,245,239,0.92)_0%,rgba(248,245,239,0.74)_26%,rgba(248,245,239,0.22)_48%,rgba(248,245,239,0.04)_68%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_24%,rgba(16,16,16,0.05)_100%)]" />
        <div className="page-shell relative flex h-full items-center">
          <motion.div
            className="max-w-[29rem] pt-12"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.85,
              delay: reduceMotion ? 0 : 0.18,
              ease: premiumEase,
            }}
          >
            <p className="eyebrow text-black/55">{eyebrow}</p>
            <h1 className="mt-5 font-serif text-[3.6rem] leading-[0.88] text-[#1e1e1e] min-[390px]:text-[4.4rem] sm:text-[5.2rem] lg:text-[6.2rem]">
              {heading}
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-black/68 sm:text-base">
              {body}
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[390px]:flex-row min-[390px]:flex-wrap">
              <Button
                href={primaryCta.href}
                className="border-[#1e1e1e] bg-[#1e1e1e] px-6 text-[#f8f5ef] before:bg-[#343434] hover:border-[#343434]"
              >
                {primaryCta.label}
              </Button>
              <Button
                href={secondaryCta.href}
                variant="secondary"
                className="border-[#1e1e1e]/25 bg-[#f8f5ef]/88 px-6 text-[#1e1e1e] before:bg-white hover:border-[#1e1e1e]"
              >
                {secondaryCta.label}
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
