export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-stone-200 ${className}`} aria-hidden />;
}
