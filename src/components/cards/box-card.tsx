"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ProductBox } from "@/lib/types";
import { formatTnd } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export function BoxCard({ box }: { box: ProductBox }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
      className="h-full border border-border bg-white p-3 sm:p-4"
    >
      <Link href={`/boxes/${box.slug}`} className="group flex h-full flex-col">
        <div className="relative">
          <ImagePlaceholder label={box.placeholderImageLabel} ratio="landscape" hoverZoom />
          <div className="absolute left-3 top-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1">
            <Badge>Save {formatTnd(box.savingsTnd)}</Badge>
          </div>
        </div>
        <div className="grid min-h-[150px] gap-3 px-1 pb-2 pt-5 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-charcoal/60">
              {box.occasion} edit
            </p>
            <h3 className="mt-1 font-serif text-3xl">{box.name}</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-charcoal">{box.description}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm">{formatTnd(box.boxPriceTnd)}</p>
            <p className="mt-1 text-xs text-charcoal/50 line-through">
              {formatTnd(box.individualTotalPriceTnd)}
            </p>
          </div>
        </div>
        <div className="mx-1 mt-auto flex items-center justify-between border-t border-border pt-4 text-[10px] font-semibold uppercase tracking-[0.16em]">
          <span>View capsule</span>
          <span className="transition-transform duration-300 group-hover:translate-x-2" aria-hidden>→</span>
        </div>
      </Link>
    </motion.article>
  );
}
