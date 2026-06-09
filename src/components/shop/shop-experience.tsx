"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ProductCard } from "@/components/cards/product-card";
import { InlineLoader } from "@/components/loaders";
import { PageIntro } from "@/components/sections/page-intro";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { categories, collections, colors, products, sizes } from "@/data";
import { useDialog } from "@/lib/use-dialog";

const arrayKeys = ["category", "size", "color", "availability", "collection"] as const;
type ArrayKey = (typeof arrayKeys)[number];

const availabilityOptions = [
  ["in-stock", "In stock"],
  ["new", "New arrivals"],
  ["best-seller", "Best sellers"],
  ["limited", "Limited"],
] as const;

const sortOptions = [
  ["recommended", "Recommended"],
  ["newest", "Newest"],
  ["price-low", "Price Low–High"],
  ["price-high", "Price High–Low"],
] as const;

const productsPerPage = 4;

function values(params: URLSearchParams, key: string) {
  return params.get(key)?.split(",").filter(Boolean) ?? [];
}

export function ShopExperience() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const reduceMotion = useReducedMotion();
  const listingRef = useRef<HTMLDivElement>(null);

  const updateParams = (
    updater: (params: URLSearchParams) => void,
    options: { resetPage?: boolean; scrollToListing?: boolean } = {},
  ) => {
    const next = new URLSearchParams(searchParams.toString());
    updater(next);
    if (options.resetPage !== false) next.delete("page");
    startTransition(() => {
      router.push(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false });
    });
    if (options.scrollToListing) {
      requestAnimationFrame(() => {
        listingRef.current?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  };

  const toggleValue = (key: ArrayKey, value: string) => {
    updateParams((params) => {
      const selected = values(params, key);
      const next = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      if (next.length) params.set(key, next.join(","));
      else params.delete(key);
    });
  };

  const clearAll = () => startTransition(() => router.push(pathname, { scroll: false }));
  const activeFilters: { key: string; value: string }[] = arrayKeys.flatMap((key) =>
    values(searchParams, key).map((value) => ({ key, value })),
  );
  if (searchParams.get("priceMin")) activeFilters.push({ key: "priceMin", value: searchParams.get("priceMin")! });
  if (searchParams.get("priceMax")) activeFilters.push({ key: "priceMax", value: searchParams.get("priceMax")! });

  const filteredProducts = useMemo(() => {
    const selectedCategories = values(searchParams, "category");
    const selectedSizes = values(searchParams, "size");
    const selectedColors = values(searchParams, "color");
    const selectedAvailability = values(searchParams, "availability");
    const selectedCollections = values(searchParams, "collection");
    const min = Number(searchParams.get("priceMin") || 0);
    const max = Number(searchParams.get("priceMax") || Number.POSITIVE_INFINITY);

    const result = products.filter((product) => {
      if (selectedCategories.length && !selectedCategories.includes(product.category)) return false;
      if (selectedSizes.length && !selectedSizes.some((size) => product.sizes.includes(size) && !product.unavailableSizes.includes(size))) return false;
      if (selectedColors.length && !selectedColors.some((color) => product.colors.some((item) => item.id === color))) return false;
      if (selectedCollections.length && !selectedCollections.includes(product.collection)) return false;
      if (product.priceTnd < min || product.priceTnd > max) return false;
      if (selectedAvailability.length) {
        const matches = selectedAvailability.some((status) => {
          if (status === "in-stock") return product.availability !== "out-of-stock";
          if (status === "new") return product.isNew;
          if (status === "best-seller") return product.isBestSeller;
          if (status === "limited") return product.badges.some((badge) => badge.toLowerCase() === "limited");
          return false;
        });
        if (!matches) return false;
      }
      return true;
    });

    const sort = searchParams.get("sort") ?? "recommended";
    return [...result].sort((a, b) => {
      if (sort === "newest") return Number(b.isNew) - Number(a.isNew);
      if (sort === "price-low") return a.priceTnd - b.priceTnd;
      if (sort === "price-high") return b.priceTnd - a.priceTnd;
      return Number(b.isBestSeller) - Number(a.isBestSeller);
    });
  }, [searchParams]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const requestedPage = Number(searchParams.get("page") ?? "1");
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, totalPages)
      : 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  useEffect(() => {
    if (!searchParams.has("page") || requestedPage === currentPage) return;
    const next = new URLSearchParams(searchParams.toString());
    if (currentPage === 1) next.delete("page");
    else next.set("page", String(currentPage));
    router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, {
      scroll: false,
    });
  }, [currentPage, pathname, requestedPage, router, searchParams]);

  const goToPage = (page: number) => {
    updateParams(
      (params) => {
        if (page <= 1) params.delete("page");
        else params.set("page", String(page));
      },
      { resetPage: false, scrollToListing: true },
    );
  };

  const removeFilter = (key: string, value: string) => {
    updateParams((params) => {
      if (key === "priceMin" || key === "priceMax") {
        params.delete(key);
        return;
      }
      const next = values(params, key).filter((item) => item !== value);
      if (next.length) params.set(key, next.join(","));
      else params.delete(key);
    });
  };
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const filterDialog = useDialog(drawerOpen, closeDrawer);

  return (
    <>
      <PageIntro
        eyebrow="The collection"
        title="Shop all"
        description="A concise wardrobe of contemporary dresses, tailoring, separates, and considered accessories."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      />
      <div ref={listingRef} className="sticky top-16 z-20 scroll-mt-16 border-b border-border bg-white lg:top-[72px] lg:scroll-mt-[72px]">
        <div className="page-shell flex min-h-14 items-center justify-between gap-2 py-2">
          <button
            ref={filterDialog.triggerRef}
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="group inline-flex min-h-10 shrink-0 items-center gap-2 border border-black bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-black hover:text-white min-[390px]:gap-3 min-[390px]:px-4 min-[390px]:text-xs min-[390px]:tracking-[0.14em]"
          >
            <span aria-hidden className="flex w-4 flex-col gap-[3px]">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-3/4 bg-current" />
              <span className="h-px w-1/2 bg-current" />
            </span>
            Filters <span className="text-current/60">({activeFilters.length})</span>
          </button>
          <p className="hidden text-xs text-charcoal/60 sm:block">{filteredProducts.length} pieces</p>
          <label className="flex min-w-0 items-center gap-2 text-[10px] uppercase tracking-[0.1em] min-[390px]:text-xs min-[390px]:tracking-[0.12em]">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={searchParams.get("sort") ?? "recommended"}
              onChange={(event) => updateParams((params) => params.set("sort", event.target.value))}
              className="min-w-0 max-w-[132px] bg-transparent py-2 text-[10px] outline-none min-[390px]:max-w-none min-[390px]:text-xs"
            >
              {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="page-shell py-8 lg:py-12" aria-busy={isPending}>
        {isPending && (
          <div className="mb-5 flex justify-end">
            <InlineLoader label="Updating edit" />
          </div>
        )}
        {activeFilters.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            {activeFilters.map((filter) => (
              <button
                key={`${filter.key}-${filter.value}`}
                type="button"
                onClick={() => removeFilter(filter.key, filter.value)}
                className="border border-border bg-off-white px-3 py-2 text-[10px] uppercase tracking-[0.12em]"
              >
                {filter.key === "priceMin" ? `From ${filter.value} TND` : filter.key === "priceMax" ? `To ${filter.value} TND` : filter.value.replaceAll("-", " ")} ×
              </button>
            ))}
            <button type="button" onClick={clearAll} className="ml-2 text-xs underline">Clear all</button>
          </div>
        )}

        {filteredProducts.length ? (
          <div className="grid grid-cols-1 gap-y-12 min-[380px]:grid-cols-2 min-[380px]:gap-x-4 lg:grid-cols-4 lg:gap-x-6">
            {paginatedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <EmptyState
            title="No pieces match your filters."
            description="Try removing one or more filters to see more pieces."
            actionLabel="Clear filters"
            actionHref="/shop"
          />
        )}
        {filteredProducts.length > productsPerPage && (
          <nav
            className="mt-14 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-8"
            aria-label="Product pagination"
          >
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || isPending}
              className="min-h-11 border border-border px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                aria-label={`Go to product page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
                onClick={() => goToPage(page)}
                disabled={isPending}
                className={`size-11 border text-xs transition-colors ${
                  page === currentPage
                    ? "border-black bg-black text-white"
                    : "border-border hover:border-black"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || isPending}
              className="min-h-11 border border-border px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next
            </button>
          </nav>
        )}
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close filters"
              className="fixed inset-0 z-[60] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              ref={filterDialog.dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Product filters"
              className="fixed inset-y-0 left-0 z-[61] flex w-full flex-col bg-white sm:max-w-md"
              initial={reduceMotion ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 min-[390px]:px-5">
                <h2 className="font-serif text-2xl">Filter the collection</h2>
                <button type="button" onClick={closeDrawer} aria-label="Close filters" className="size-10 text-2xl">×</button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 min-[390px]:p-5">
                <FilterGroup title="Category" options={categories.map((item) => [item.slug, item.name])} selected={values(searchParams, "category")} onToggle={(value) => toggleValue("category", value)} />
                <FilterGroup title="Size" options={sizes.map((item) => [item.id, item.label])} selected={values(searchParams, "size")} onToggle={(value) => toggleValue("size", value)} />
                <FilterGroup title="Color" options={colors.map((item) => [item.id, item.name])} selected={values(searchParams, "color")} onToggle={(value) => toggleValue("color", value)} colors />
                <div className="border-b border-border py-5">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em]">Price range</h3>
                  <div className="mt-4 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
                    <label className="text-xs text-charcoal">Minimum TND<input type="number" defaultValue={searchParams.get("priceMin") ?? ""} onBlur={(event) => updateParams((params) => event.target.value ? params.set("priceMin", event.target.value) : params.delete("priceMin"))} className="mt-2 w-full border border-border px-3 py-3 text-black" /></label>
                    <label className="text-xs text-charcoal">Maximum TND<input type="number" defaultValue={searchParams.get("priceMax") ?? ""} onBlur={(event) => updateParams((params) => event.target.value ? params.set("priceMax", event.target.value) : params.delete("priceMax"))} className="mt-2 w-full border border-border px-3 py-3 text-black" /></label>
                  </div>
                </div>
                <FilterGroup title="Availability" options={availabilityOptions.map((item) => [...item])} selected={values(searchParams, "availability")} onToggle={(value) => toggleValue("availability", value)} />
                <FilterGroup title="Collection" options={collections.map((item) => [item.slug, item.name])} selected={values(searchParams, "collection")} onToggle={(value) => toggleValue("collection", value)} />
              </div>
              <div className="grid shrink-0 grid-cols-1 gap-3 border-t border-border bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] min-[390px]:grid-cols-[auto_1fr] min-[390px]:p-5">
                <button type="button" onClick={clearAll} className="px-3 text-xs uppercase tracking-[0.12em] underline">Clear all</button>
                <Button
                  loading={isPending}
                  loadingLabel="Updating…"
                  onClick={() => setDrawerOpen(false)}
                >
                  Show {filteredProducts.length} Products
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
  colors: showColors = false,
}: {
  title: string;
  options: string[][];
  selected: string[];
  onToggle: (value: string) => void;
  colors?: boolean;
}) {
  return (
    <fieldset className="border-b border-border py-5">
      <legend className="text-xs font-semibold uppercase tracking-[0.14em]">{title}</legend>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {options.map(([value, label]) => {
          const color = colors.find((item) => item.id === value);
          return (
            <label key={value} className="flex cursor-pointer items-center gap-3 text-sm">
              <input type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(value)} className="size-4 accent-black" />
              {showColors && color && <span className="size-4 border border-black/20" style={{ backgroundColor: color.hex }} />}
              {label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
