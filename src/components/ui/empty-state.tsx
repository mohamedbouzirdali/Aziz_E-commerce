import { Button } from "./button";

export function EmptyState({
  title,
  description,
  actionLabel = "Continue shopping",
  actionHref = "/shop",
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-24 text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-charcoal/60">Nothing here yet</p>
      <h1 className="font-serif text-4xl">{title}</h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-charcoal">{description}</p>
      <Button href={actionHref} className="mt-8">
        {actionLabel}
      </Button>
    </div>
  );
}
