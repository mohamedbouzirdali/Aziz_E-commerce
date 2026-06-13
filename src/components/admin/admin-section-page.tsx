import { requireStaff } from "@/lib/auth/session";

export async function AdminSectionPage({
  eyebrow,
  title,
  description,
  capabilities,
  note,
}: {
  eyebrow: string;
  title: string;
  description: string;
  capabilities: string[];
  note: string;
}) {
  await requireStaff();

  return (
    <div>
      <header className="border-b border-border pb-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal">
          {description}
        </p>
      </header>

      <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2">
        {capabilities.map((capability, index) => (
          <article key={capability} className="bg-white p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
              Capability {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-4 font-serif text-2xl">{capability}</h2>
          </article>
        ))}
      </div>

      <p className="mt-8 border-l border-black px-5 text-xs leading-6 text-charcoal">
        {note}
      </p>
    </div>
  );
}
