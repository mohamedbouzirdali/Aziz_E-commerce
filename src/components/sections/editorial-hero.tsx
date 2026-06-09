"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { premiumEase } from "@/lib/motion";

const imageMotion: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.985 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, delay, ease: premiumEase },
  }),
};

export function EditorialHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-border bg-off-white">
      <div className="page-shell relative pt-12 sm:pt-16 lg:pt-20">
        <motion.div
          className="relative z-10 max-w-3xl"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
          }}
        >
          <motion.p
            className="eyebrow"
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
          >
            New collection · Study 01
          </motion.p>
          <motion.h1
            className="mt-5 font-serif text-[clamp(3.25rem,8vw,7.5rem)] leading-[0.82] tracking-[-0.04em]"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: premiumEase } },
            }}
          >
            Form,
            <br />
            <span className="italic">softened.</span>
          </motion.h1>
          <motion.p
            className="mt-7 max-w-xl text-sm leading-7 text-charcoal sm:text-base"
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.65 } },
            }}
          >
            Contemporary pieces composed around movement, proportion, and the quiet confidence of less.
          </motion.p>
        </motion.div>
      </div>

      <div className="mx-auto mt-12 grid w-full grid-cols-3 items-start gap-3 px-4 pb-10 sm:mt-14 sm:gap-6 sm:px-8 sm:pb-14 lg:mt-16 lg:gap-8 lg:px-[4vw] lg:pb-20">
          <motion.div
            className="min-w-0"
            variants={imageMotion}
            custom={0.18}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
          >
            <ImagePlaceholder
              label="Full-length campaign portrait"
              ratio="portrait"
              className="shadow-[0_20px_55px_rgba(17,17,17,0.06)]"
              hoverZoom
            />
          </motion.div>

          <motion.div
            className="min-w-0"
            variants={imageMotion}
            custom={0.34}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
          >
            <ImagePlaceholder
              label="Campaign portrait in soft tailoring"
              ratio="portrait"
              className="shadow-[0_24px_70px_rgba(17,17,17,0.08)]"
              hoverZoom
            />
          </motion.div>

          <motion.div
            className="min-w-0"
            variants={imageMotion}
            custom={0.5}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
          >
            <ImagePlaceholder
              label="Campaign portrait with fluid movement"
              ratio="portrait"
              className="shadow-[0_20px_55px_rgba(17,17,17,0.06)]"
              hoverZoom
            />
          </motion.div>
      </div>

      <div className="page-shell pb-12 sm:pb-16 lg:pb-20">
        <motion.div
          className="flex flex-col gap-5 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 0.75, duration: 0.65 }}
        >
          <div className="flex w-full flex-col gap-3 min-[390px]:w-auto min-[390px]:flex-row min-[390px]:flex-wrap">
            <Button href="/shop?sort=newest" className="w-full min-[390px]:w-auto">Shop New In</Button>
            <Button href="/boxes" variant="secondary" className="w-full min-[390px]:w-auto">Explore Boxes</Button>
          </div>
          <a
            href="#curated-edits"
            className="group flex items-center justify-between gap-5 border-b border-black pb-2 text-[10px] font-semibold uppercase tracking-[0.18em]"
          >
            Discover the edit
            <span className="transition-transform duration-300 group-hover:translate-x-2" aria-hidden>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
