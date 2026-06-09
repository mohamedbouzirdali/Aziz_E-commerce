export function ProductImageSkeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`skeleton-shimmer aspect-[4/5] border border-border bg-stone-100 ${className}`}
    />
  );
}
