import { PageIntro } from "./page-intro";

export function PlaceholderPage({
  eyebrow = "Phase one",
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <PageIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]}
      />
      <div className="page-shell py-16 lg:py-24">
        {children ?? (
          <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
            {["Structure prepared", "UI state reserved", "Content to follow"].map((label) => (
              <div key={label} className="bg-white p-8">
                <p className="eyebrow">{label}</p>
                <div className="mt-8 h-px bg-border" />
                <p className="mt-5 text-sm leading-6 text-charcoal">
                  This route is included in the architecture and ready for its dedicated flow in a later phase.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
