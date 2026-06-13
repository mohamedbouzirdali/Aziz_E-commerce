"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { ImageRatio } from "@/lib/types";
import { imageZoom, premiumEase } from "@/lib/motion";

const ratios: Record<ImageRatio, string> = {
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  landscape: "aspect-[16/9]",
};

type ImagePlaceholderProps = {
  label: string;
  ratio?: ImageRatio;
  className?: string;
  hoverZoom?: boolean;
  src?: string;
  alt?: string;
};

export function ImagePlaceholder({
  label,
  ratio = "portrait",
  className = "",
  hoverZoom = false,
  src,
  alt,
}: ImagePlaceholderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`group relative overflow-hidden bg-stone-100 ${ratios[ratio]} ${className}`}
      role={src ? undefined : "img"}
      aria-label={src ? undefined : `Placeholder: ${label}`}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#f1eee8_0%,#e4e0d8_50%,#f5f3ef_100%)]"
        whileHover={hoverZoom && !reduceMotion ? imageZoom : undefined}
        transition={{ duration: 0.65, ease: premiumEase }}
      >
        {src && (
          <Image
            src={src}
            alt={alt || label}
            fill
            sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-4 border border-black/10" />
        {!src && (
          <span className="max-w-[70%] text-center text-[10px] font-medium uppercase tracking-[0.18em] text-charcoal/55">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
