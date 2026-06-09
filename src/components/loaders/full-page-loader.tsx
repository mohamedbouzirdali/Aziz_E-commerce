"use client";

import { motion, useReducedMotion } from "framer-motion";

export function FullPageLoader({
  label = "Preparing the edit",
  fullScreen = true,
  className = "",
}: {
  label?: string;
  fullScreen?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-busy="true"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex items-center justify-center bg-off-white px-6 ${
        fullScreen ? "min-h-[calc(100svh-104px)]" : "min-h-80"
      } ${className}`}
    >
      <div className="w-full max-w-64 text-center">
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl tracking-[0.24em]"
        >
          ÉLAN
        </motion.p>
        <div className="relative mx-auto mt-6 h-px w-44 overflow-hidden bg-black/15">
          <motion.span
            className="absolute inset-y-0 left-0 w-full origin-left bg-black"
            initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.15, ease: [0.22, 1, 0.36, 1] }}
          />
          {!reduceMotion && (
            <motion.span
              className="absolute -top-[2px] size-[5px] rounded-full bg-black"
              initial={{ left: "0%" }}
              animate={{ left: "calc(100% - 5px)" }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </div>
        <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-charcoal/55">{label}</p>
      </div>
    </motion.div>
  );
}
