import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";

export function PageIntro({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <div className="border-b border-border px-4 py-9 min-[390px]:px-5 min-[390px]:py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-7xl">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        {eyebrow && <p className="eyebrow mt-7">{eyebrow}</p>}
        <h1 className="mt-3 max-w-4xl font-serif text-4xl leading-[0.95] min-[390px]:text-5xl sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-sm leading-6 text-charcoal sm:text-base">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
