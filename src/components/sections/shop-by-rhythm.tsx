"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { AdminEditableImage } from "@/components/admin/storefront-edit-controls";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export type RhythmItem = {
  number?: string;
  moment?: string;
  title: string;
  description: string;
  label: string;
  href: string;
  cta?: string;
  note?: string;
  imageUrl?: string;
  itemId?: string;
};

const rhythms: RhythmItem[] = [
  {
    number: "01",
    moment: "Quotidien",
    title: "L’édit quotidien",
    description: "Des bases fluides pour les matins en mouvement et les plans qui se déploient lentement.",
    label: "Édit mouvement quotidien",
    href: "/shop?collection=everyday-edit",
    cta: "Découvrir l’édit",
    note: "Couches fluides · À porter souvent",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=82",
  },
  {
    number: "02",
    moment: "En focus",
    title: "Tailleur souple",
    description: "Un tailleur relâché qui reste maîtrisé sans jamais sembler rigide.",
    label: "Édit workwear moderne",
    href: "/shop?category=tailoring",
    cta: "Découvrir le tailleur",
    note: "Lignes nettes · Structure douce",
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=82",
  },
  {
    number: "03",
    moment: "Après les heures",
    title: "Après la tombée du jour",
    description: "Des silhouettes nettes, des lignes fluides et une expression subtile pour les soirées à venir.",
    label: "Édit mouvement du soir",
    href: "/shop?collection=after-dark",
    cta: "Découvrir le soir",
    note: "Formes fluides · Impact discret",
    imageUrl:
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&w=1200&q=82",
  },
  {
    number: "04",
    moment: "Assemblé avec soin",
    title: "L’édit capsule",
    description: "Des capsules pensées pour que s’habiller devienne instinctif.",
    label: "Coffret capsule sélectionné",
    href: "/boxes",
    cta: "Découvrir les coffrets",
    note: "Silhouettes complètes · Valeur réfléchie",
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=82",
  },
];

export function ShopByRhythm({
  eyebrow = "The ÉLAN edits · Shop by rhythm",
  heading = "Un vestiaire pour chaque mouvement.",
  body = "Quatre directions pensées pour le rythme, l’intention et l’atmosphère de votre journée.",
  items = rhythms,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  items?: RhythmItem[];
}) {
  const reduceMotion = useReducedMotion();
  const headingParts = heading.toLowerCase().includes("chaque mouvement")
    ? [heading.slice(0, heading.toLowerCase().indexOf("chaque mouvement")), "chaque mouvement."]
    : [heading, ""];

  return (
    <section className="overflow-hidden bg-off-white py-14 lg:py-20">
      <div className="page-shell">
        <div className="grid gap-8 border-t border-black/10 pt-10 md:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.55fr)] md:items-end lg:pt-12">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-4 font-serif text-[clamp(2.5rem,11vw,6rem)] leading-[0.88] tracking-[-0.035em]">
              {headingParts[0]}
              {headingParts[1] && (
                <>
                  <br />
                  <span className="whitespace-nowrap italic">
                    {headingParts[1]}
                  </span>
                </>
              )}
            </h2>
          </div>
          <div className="max-w-sm md:justify-self-end md:pb-1">
            <p className="text-sm leading-7 text-charcoal/75">
              {body}
            </p>
            <Link
              href="/shop"
              className="link-underline mt-5 inline-block text-[10px] font-semibold uppercase tracking-[0.16em]"
            >
              Voir toute la collection
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 flex snap-x snap-proximity gap-4 overflow-x-auto px-[max(1.25rem,calc((100vw-80rem)/2+3rem))] pb-4 [scrollbar-width:none] sm:gap-5 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-4 lg:overflow-visible lg:px-12 lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {items.map((rhythm, index) => (
          <motion.article
            key={rhythm.title}
            className="w-[82vw] max-w-[360px] shrink-0 snap-start sm:w-[44vw] lg:w-auto lg:max-w-none"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px -40px" }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: index * 0.05 }}
          >
            <div className="group flex h-full flex-col bg-white">
              <div className="relative overflow-hidden">
                <AdminEditableImage itemId={rhythm.itemId} label={rhythm.label}>
                  <Link href={rhythm.href} className="block">
                    <ImagePlaceholder
                      label={rhythm.label}
                      ratio="portrait"
                      className="w-full"
                      hoverZoom
                      src={rhythm.imageUrl}
                      alt={rhythm.label}
                    />
                  </Link>
                </AdminEditableImage>
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span className="flex size-9 items-center justify-center border border-black/15 bg-white/90 text-[9px] font-semibold tracking-[0.12em]">
                    {rhythm.number ?? String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="bg-white/90 px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.16em]">
                    {rhythm.moment ?? "Édit evoflex"}
                  </span>
                </div>
              </div>
              <Link
                href={rhythm.href}
                className="flex min-h-[235px] flex-1 flex-col border-x border-b border-black/15 px-5 pb-5 pt-6 transition-colors duration-300 group-hover:border-black"
              >
                <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-charcoal/45">
                  {rhythm.note ?? "Vestiaire réfléchi"}
                </p>
                <h3 className="mt-3 min-h-[3.5rem] font-serif text-3xl leading-[0.95]">
                  {rhythm.title}
                </h3>
                <p className="mt-4 text-xs leading-6 text-charcoal/70">
                  {rhythm.description}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-[9px] font-semibold uppercase tracking-[0.15em]">
                  <span>{rhythm.cta ?? "Explorer l’édit"}</span>
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
