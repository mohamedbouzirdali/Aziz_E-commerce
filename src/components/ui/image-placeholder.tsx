"use client";

import { motion, useReducedMotion } from "framer-motion";
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
};

export function ImagePlaceholder({
  label,
  ratio = "portrait",
  className = "",
  hoverZoom = false,
}: ImagePlaceholderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`group relative overflow-hidden bg-stone-100 ${ratios[ratio]} ${className}`}
      role="img"
      aria-label={`Placeholder: ${label}`}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,#f1eee8_0%,#e4e0d8_50%,#f5f3ef_100%)]"
        whileHover={hoverZoom && !reduceMotion ? imageZoom : undefined}
        transition={{ duration: 0.65, ease: premiumEase }}
      >
        <div className="absolute inset-4 border border-black/10" />
        <span className="max-w-[70%] text-center text-[10px] font-medium uppercase tracking-[0.18em] text-charcoal/55">
          {label}
        </span>
      </motion.div>
    </div>
  );
}
