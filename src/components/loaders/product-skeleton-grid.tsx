import { ProductImageSkeleton } from "./product-image-skeleton";

export function ProductSkeletonGrid({
  count = 8,
  className = "",
}: {
  count?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="Loading products"
      aria-busy="true"
      className={`grid grid-cols-1 gap-y-12 min-[380px]:grid-cols-2 min-[380px]:gap-x-4 lg:grid-cols-4 lg:gap-x-6 ${className}`}
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          <ProductImageSkeleton />
          <div className="pt-4">
            <div className="skeleton-shimmer h-3 w-3/5 bg-stone-100" />
            <div className="mt-3 flex justify-between gap-5">
              <div className="skeleton-shimmer h-2 w-2/5 bg-stone-100" />
              <div className="skeleton-shimmer h-2 w-16 bg-stone-100" />
            </div>
            <div className="mt-4 flex gap-2">
              {Array.from({ length: 3 }, (_, swatch) => (
                <div key={swatch} className="skeleton-shimmer size-5 border border-border bg-stone-100" />
              ))}
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Curating pieces</span>
    </div>
  );
}
