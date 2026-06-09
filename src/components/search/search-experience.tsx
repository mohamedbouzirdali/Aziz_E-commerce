"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/cards/product-card";
import { products } from "@/data";
import { fadeUp, premiumEase } from "@/lib/motion";

const suggestions = [
  ["Dresses", "/shop?category=dresses"],
  ["Tailoring", "/shop?category=tailoring"],
  ["Boxes", "/boxes"],
  ["Best Sellers", "/shop?availability=best-seller"],
];

export function SearchExperience() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    inputRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (query) setQuery("");
      else router.back();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [query, router]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return products.filter((product) => {
      const searchable = [
        product.name,
        product.description,
        product.category,
        product.collection,
        ...product.colors.map((color) => color.name),
      ].join(" ").toLowerCase();
      return searchable.includes(normalized);
    });
  }, [query]);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.3 }}
      className="min-h-[70svh]"
    >
      <section className="border-b border-border bg-off-white">
        <div className="page-shell py-12 sm:py-16 lg:py-20">
          <p className="eyebrow">Product discovery</p>
          <h1 className="mt-4 font-serif text-4xl min-[390px]:text-5xl sm:text-7xl">Search the collection.</h1>
          <div className="mt-10 flex border-b border-black pb-3">
            <label htmlFor="catalog-search" className="sr-only">Search products</label>
            <input
              ref={inputRef}
              id="catalog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dresses, tailoring, colors..."
              className="min-w-0 flex-1 bg-transparent text-xl outline-none placeholder:text-charcoal/35 sm:text-3xl"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="px-3 text-xs uppercase tracking-[0.12em]">
                Clear
              </button>
            )}
          </div>
          {!query && (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/55">Popular</span>
              {suggestions.map(([label, href]) => (
                <Link key={label} href={href} className="border border-border bg-white px-4 py-2 text-xs hover:border-black">
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="page-shell py-10 lg:py-14" aria-live="polite">
        <AnimatePresence mode="wait">
          {!query ? (
            <motion.div key="prompt" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" className="py-14 text-center">
              <p className="font-serif text-3xl">Curated pieces for work, evenings, and everyday ease.</p>
              <p className="mt-3 text-sm text-charcoal">Begin typing to explore the collection.</p>
            </motion.div>
          ) : results.length ? (
            <motion.div
              key={query}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: premiumEase }}
            >
              <p className="mb-7 text-xs text-charcoal">{results.length} {results.length === 1 ? "piece" : "pieces"} found</p>
              <div className="grid grid-cols-1 gap-y-12 min-[380px]:grid-cols-2 min-[380px]:gap-x-4 lg:grid-cols-4 lg:gap-x-6">
                {results.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" variants={fadeUp} initial="hidden" animate="visible" exit="hidden" className="py-20 text-center">
              <h2 className="font-serif text-4xl">No pieces found.</h2>
              <p className="mt-4 text-sm text-charcoal">Try another product, category, collection, or color.</p>
              <button type="button" onClick={() => setQuery("")} className="link-underline mt-7 text-xs font-semibold uppercase tracking-[0.14em]">
                Clear search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
