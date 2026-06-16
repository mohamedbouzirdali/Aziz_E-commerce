"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ButtonLoadingState({ label = "Mise à jour…" }: { label?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="inline-flex items-center gap-2" aria-live="polite">
      <span className="relative h-px w-6 overflow-hidden bg-current/25">
        <motion.span
          className="absolute inset-y-0 left-0 w-1/2 bg-current"
          animate={reduceMotion ? { x: "0%" } : { x: ["-100%", "200%"] }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
      <span>{label}</span>
    </span>
  );
}
