"use client";

import { motion, useReducedMotion } from "framer-motion";

export function InlineLoader({
  label = "Mise à jour de la sélection",
  size = "md",
  className = "",
}: {
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <span
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`inline-flex items-center gap-3 ${size === "sm" ? "text-[9px]" : "text-[10px]"} uppercase tracking-[0.14em] ${className}`}
    >
      <span className={`${size === "sm" ? "w-8" : "w-12"} relative h-px overflow-hidden bg-current/20`}>
        <motion.span
          className="absolute inset-y-0 left-0 w-1/2 bg-current"
          animate={reduceMotion ? { x: "0%" } : { x: ["-100%", "200%"] }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
      <span>{label}</span>
    </span>
  );
}
