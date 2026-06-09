import { ProductImageSkeleton } from "@/components/loaders";

export default function ProductLoading() {
  return (
    <div className="page-shell grid gap-8 py-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.55fr)] lg:gap-14">
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }, (_, index) => <ProductImageSkeleton key={index} />)}
      </div>
      <div aria-busy="true">
        <div className="skeleton-shimmer h-2 w-28 bg-stone-100" />
        <div className="skeleton-shimmer mt-6 h-10 w-4/5 bg-stone-100" />
        <div className="skeleton-shimmer mt-4 h-3 w-24 bg-stone-100" />
        <div className="skeleton-shimmer mt-8 h-20 w-full bg-stone-100" />
        <div className="skeleton-shimmer mt-8 h-28 w-full bg-stone-100" />
      </div>
    </div>
  );
}
