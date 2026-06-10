"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

const rhythms = [
  {
    number: "01",
    moment: "Everyday",
    title: "Ease, uninterrupted.",
    description: "Fluid foundations for mornings in motion and plans that unfold slowly.",
    label: "Everyday movement edit",
    href: "/shop?collection=everyday-edit",
    cta: "Explore everyday",
  },
  {
    number: "02",
    moment: "In focus",
    title: "Soft structure. Clear intent.",
    description: "Relaxed tailoring that remains composed without ever feeling rigid.",
    label: "Modern workwear edit",
    href: "/shop?category=tailoring",
    cta: "Explore tailoring",
  },
  {
    number: "03",
    moment: "After hours",
    title: "A quieter statement.",
    description: "Clean silhouettes, fluid lines, and subtle expression for evenings ahead.",
    label: "Evening movement edit",
    href: "/shop?collection=after-dark",
    cta: "Explore evening",
  },
  {
    number: "04",
    moment: "Curated together",
    title: "One complete direction.",
    description: "Considered capsules assembled to make getting dressed feel effortless.",
    label: "Curated capsule box",
    href: "/boxes",
    cta: "Explore capsules",
  },
];

export function ShopByRhythm() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="overflow-hidden border-y border-border bg-off-white py-16 lg:py-28">
      <div className="page-shell">
        <div className="grid gap-8 border-b border-black/15 pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:pb-14">
          <div className="max-w-sm">
            <p className="eyebrow">Shop by rhythm · The ÉLAN edit</p>
            <p className="mt-5 text-sm leading-7 text-charcoal/75">
              From first movement to evening plans, each edit is composed around how a day feels, not only how it looks.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <h2 className="max-w-3xl font-serif text-[clamp(3rem,7vw,6.5rem)] leading-[0.82] tracking-[-0.035em]">
              A wardrobe
              <br />
              <span className="italic">in motion.</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-10 flex snap-x snap-proximity gap-4 overflow-x-auto px-[max(1.25rem,calc((100vw-80rem)/2+3rem))] pb-4 [scrollbar-width:none] sm:gap-5 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:overflow-visible lg:px-12 lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {rhythms.map((rhythm, index) => (
          <motion.article
            key={rhythm.title}
            className="w-[82vw] max-w-[390px] shrink-0 snap-start sm:w-[46vw] lg:w-auto lg:max-w-none"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px -40px" }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: index * 0.05 }}
          >
            <Link
              href={rhythm.href}
              className="group grid h-full border border-black/15 bg-white p-2 transition-colors duration-300 hover:border-black sm:p-3 lg:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="relative">
                <ImagePlaceholder
                  label={rhythm.label}
                  ratio="portrait"
                  className="h-full min-h-[340px] lg:min-h-[430px]"
                  hoverZoom
                />
                <span className="absolute left-4 top-4 flex size-10 items-center justify-center border border-black/15 bg-white/90 text-[10px] font-semibold tracking-[0.12em]">
                  {rhythm.number}
                </span>
              </div>
              <div className="flex min-h-[250px] flex-col px-3 pb-4 pt-5 sm:px-4 lg:min-h-0 lg:px-6 lg:py-7">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-charcoal/50">
                  {rhythm.moment}
                </p>
                <div className="mt-5">
                  <h3 className="max-w-xs font-serif text-3xl leading-[0.95] sm:text-4xl">
                    {rhythm.title}
                  </h3>
                  <p className="mt-5 max-w-xs text-xs leading-6 text-charcoal/70">
                    {rhythm.description}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-[9px] font-semibold uppercase tracking-[0.15em]">
                  <span>{rhythm.cta}</span>
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>
                    →
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
