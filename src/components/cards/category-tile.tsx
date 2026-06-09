"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export function CategoryTile({ category }: { category: Category }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -5 }}
    >
      <Link href={`/shop?category=${category.slug}`} className="group block">
        <ImagePlaceholder
          label={category.placeholderImageLabel}
          ratio="portrait"
          hoverZoom
        />
        <div className="flex min-h-[112px] items-end justify-between gap-4 border-b border-border py-4 transition-[padding] duration-300 group-hover:px-2">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl">{category.name}</h3>
            <p className="mt-1 text-xs leading-5 text-charcoal/65">{category.description}</p>
          </div>
          <span className="text-lg transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden>
            →
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
