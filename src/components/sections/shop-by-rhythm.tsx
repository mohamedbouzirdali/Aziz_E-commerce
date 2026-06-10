"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

const rhythms = [
  {
    eyebrow: "01 · Everyday",
    title: "Move with ease",
    description: "Fluid foundations and soft structure for days with no fixed pace.",
    label: "Everyday movement edit",
    href: "/shop?collection=everyday-edit",
  },
  {
    eyebrow: "02 · Work",
    title: "Hold your line",
    description: "Relaxed tailoring that stays composed from first meeting to last.",
    label: "Modern workwear edit",
    href: "/shop?category=tailoring",
  },
  {
    eyebrow: "03 · After dark",
    title: "Shift the mood",
    description: "Clean silhouettes with enough expression for the hours after sunset.",
    label: "Evening movement edit",
    href: "/shop?collection=after-dark",
  },
  {
    eyebrow: "04 · Together",
    title: "Complete the set",
    description: "Considered capsules assembled to work as one complete wardrobe idea.",
    label: "Curated capsule box",
    href: "/boxes",
  },
];

export function ShopByRhythm() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-y border-border bg-white py-14 lg:py-24">
      <div className="page-shell">
        <div className="grid gap-5 border-b border-border pb-8 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="eyebrow">Shop by rhythm</p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-[0.95] min-[390px]:text-5xl sm:text-6xl">
              Designed around
              <br />
              <span className="italic">the way you live.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-charcoal sm:text-right">
            Start with the moment, then build the wardrobe around it.
          </p>
        </div>
      </div>

      <div className="mt-8 flex snap-x snap-proximity gap-4 overflow-x-auto px-[max(1.25rem,calc((100vw-80rem)/2+3rem))] pb-4 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden">
        {rhythms.map((rhythm, index) => (
          <motion.article
            key={rhythm.title}
            className="w-[76vw] max-w-[330px] shrink-0 snap-start sm:w-[42vw] lg:w-[24vw]"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px -40px" }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: index * 0.05 }}
          >
            <Link href={rhythm.href} className="group block">
              <ImagePlaceholder label={rhythm.label} ratio="portrait" hoverZoom />
              <div className="border-b border-border py-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-charcoal/50">
                  {rhythm.eyebrow}
                </p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <h3 className="font-serif text-2xl">{rhythm.title}</h3>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>
                    →
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-charcoal/65">{rhythm.description}</p>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
