"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { AdminEditableImage } from "@/components/admin/storefront-edit-controls";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

export type CuratedEditItem = {
  title: string;
  text: string;
  label: string;
  href: string;
  cta?: string;
  imageUrl?: string;
  itemId?: string;
};

const edits: CuratedEditItem[] = [
  {
    title: "Édit week-end",
    text: "Des couches souples et des proportions faciles pour les jours sans hâte.",
    label: "Silhouette week-end décontractée",
    href: "/boxes/weekend-light-box",
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Édit bureau",
    text: "Un tailleur qui garde sa ligne sans jamais sembler rigide.",
    label: "Tailleur de bureau moderne",
    href: "/boxes/modern-workday-box",
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Édit soir",
    text: "Des silhouettes discrètement expressives pour après la tombée du jour.",
    label: "Silhouettes du soir",
    href: "/boxes/evening-edit-box",
    imageUrl:
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Tailleur souple",
    text: "Une structure repensée à travers des étoffes fluides et de l’aisance.",
    label: "Détails de tailleur souple",
    href: "/shop?category=tailoring",
    imageUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=82",
  },
  {
    title: "Capsule voyage",
    text: "Un vestiaire compact conçu pour se déplacer avec élégance.",
    label: "Vestiaire capsule de voyage",
    href: "/shop?collection=everyday-edit",
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=82",
  },
];

export function CuratedEditsSlider({
  eyebrow = "Pour chaque moment",
  heading = "S’habiller avec intention.",
  body = "Glissez à gauche ou à droite pour découvrir des sélections pensées pour le travail, le voyage, le soir et les week-ends sans hâte.",
  items = edits,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
  items?: CuratedEditItem[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const nextIndex = Math.max(0, Math.min(items.length - 1, index));
    const card = track.children[nextIndex] as HTMLElement | undefined;
    card?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "start",
    });
    setActiveIndex(nextIndex);
  };

  const updateActiveCard = () => {
    const track = trackRef.current;
    if (!track) return;
    const trackLeft = track.getBoundingClientRect().left;
    const closest = Array.from(track.children).reduce(
      (best, child, index) => {
        const distance = Math.abs((child as HTMLElement).getBoundingClientRect().left - trackLeft);
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    );
    setActiveIndex(closest.index);
  };

  return (
    <section id="curated-edits" className="overflow-hidden border-y border-border bg-black py-14 text-white lg:py-24">
      <div className="page-shell">
        <div>
          <div className="max-w-xl">
            <p className="eyebrow text-white/55">{eyebrow}</p>
            <h2 className="mt-4 font-serif text-4xl leading-none min-[390px]:text-5xl sm:text-6xl">
              {heading}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
              {body}
            </p>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateActiveCard}
        className="mt-10 flex snap-x snap-proximity gap-4 overflow-x-auto overflow-y-hidden scroll-smooth px-[max(1.25rem,calc((100vw-80rem)/2+3rem))] pb-5 [overscroll-behavior-x:contain] [overscroll-behavior-y:auto] [scrollbar-width:none] [touch-action:pan-x_pan-y] sm:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((edit, index) => (
          <motion.article
            key={edit.title}
            className={`group w-[86vw] max-w-[390px] shrink-0 snap-start transition-opacity duration-500 min-[390px]:w-[78vw] sm:w-[44vw] lg:w-[31vw] ${
              activeIndex === index ? "opacity-100" : "opacity-65 hover:opacity-100"
            }`}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: activeIndex === index ? 1 : 0.65, y: 0 }}
            viewport={{ once: true, margin: "0px -80px" }}
            transition={{ duration: reduceMotion ? 0 : 0.65, delay: index * 0.05 }}
            whileHover={reduceMotion ? undefined : { y: -5 }}
          >
            <div className="flex h-full flex-col">
              <AdminEditableImage itemId={edit.itemId} label={edit.label}>
                <Link href={edit.href} className="block">
                  <ImagePlaceholder
                    label={edit.label}
                    ratio="portrait"
                    hoverZoom
                    src={edit.imageUrl}
                    alt={edit.label}
                  />
                </Link>
              </AdminEditableImage>
              <Link
                href={edit.href}
                className="flex min-h-[220px] flex-1 flex-col border-b border-white/25 py-5"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-white/45">
                      Édit {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 font-serif text-3xl">{edit.title}</h3>
                  </div>
                </div>
                <p className="mt-3 max-w-xs text-sm leading-6 text-white/65">{edit.text}</p>
                <span className="link-underline mt-auto inline-block self-start pt-5 text-[10px] font-semibold uppercase tracking-[0.16em]">
                  {edit.cta ?? "Explorer l’édit"}
                </span>
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="page-shell mt-3 flex items-center justify-between">
        <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">
          Glissez ou utilisez deux doigts pour explorer
        </p>
        <div className="ml-auto flex gap-1.5" aria-label={`Édit ${activeIndex + 1} sur ${items.length}`}>
          {items.map((edit, index) => (
            <button
              key={edit.title}
              type="button"
              aria-label={`Afficher ${edit.title}`}
              onClick={() => scrollTo(index)}
              className={`h-px transition-all duration-300 ${
                index === activeIndex ? "w-8 bg-white" : "w-4 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
