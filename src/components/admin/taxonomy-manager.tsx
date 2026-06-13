import {
  deleteTaxonomyAction,
  saveTaxonomyAction,
} from "@/app/admin/catalog-actions";
import { Button } from "@/components/ui/button";

type TaxonomyRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  position: number;
  is_active: boolean;
};

const inputClass =
  "min-h-11 w-full border border-border bg-white px-3 text-sm outline-none transition-colors focus:border-black";
const labelClass =
  "mb-2 block text-[9px] font-semibold uppercase tracking-[0.14em]";

export function TaxonomyManager({
  kind,
  rows,
  canDelete,
}: {
  kind: "category" | "collection";
  rows: TaxonomyRow[];
  canDelete: boolean;
}) {
  const singularLabel = kind === "category" ? "Category" : "Collection";

  return (
    <div className="space-y-8">
      <section className="border border-border bg-white p-6">
        <p className="eyebrow">Create {kind}</p>
        <form
          action={saveTaxonomyAction}
          className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.5fr_100px_auto]"
        >
          <input type="hidden" name="kind" value={kind} />
          <div>
            <label className={labelClass} htmlFor={`new-${kind}-name`}>
              Name
            </label>
            <input
              id={`new-${kind}-name`}
              name="name"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor={`new-${kind}-slug`}>
              Slug
            </label>
            <input
              id={`new-${kind}-slug`}
              name="slug"
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor={`new-${kind}-description`}>
              Description
            </label>
            <input
              id={`new-${kind}-description`}
              name="description"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor={`new-${kind}-position`}>
              Position
            </label>
            <input
              id={`new-${kind}-position`}
              name="position"
              type="number"
              min="0"
              step="1"
              defaultValue={rows.length}
              required
              className={inputClass}
            />
          </div>
          <div className="flex items-end gap-4">
            <label className="flex min-h-11 items-center gap-2 text-xs">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked
                className="size-4 accent-black"
              />
              Active
            </label>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="border border-border bg-white p-5">
            <form
              action={saveTaxonomyAction}
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.5fr_100px_auto]"
            >
              <input type="hidden" name="kind" value={kind} />
              <input type="hidden" name="id" value={row.id} />
              <div>
                <label className={labelClass} htmlFor={`${row.id}-name`}>
                  Name
                </label>
                <input
                  id={`${row.id}-name`}
                  name="name"
                  defaultValue={row.name}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor={`${row.id}-slug`}>
                  Slug
                </label>
                <input
                  id={`${row.id}-slug`}
                  name="slug"
                  defaultValue={row.slug}
                  required
                  pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor={`${row.id}-description`}>
                  Description
                </label>
                <input
                  id={`${row.id}-description`}
                  name="description"
                  defaultValue={row.description ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor={`${row.id}-position`}>
                  Position
                </label>
                <input
                  id={`${row.id}-position`}
                  name="position"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={row.position}
                  required
                  className={inputClass}
                />
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <label className="flex min-h-11 items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={row.is_active}
                    className="size-4 accent-black"
                  />
                  Active
                </label>
                <Button type="submit" variant="secondary">
                  Save
                </Button>
              </div>
            </form>

            {canDelete && (
              <form
                action={deleteTaxonomyAction}
                className="mt-4 border-t border-border pt-4 text-right"
              >
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="id" value={row.id} />
                <button
                  type="submit"
                  className="text-[9px] font-semibold uppercase tracking-[0.14em] text-red-800 underline decoration-red-800/30 underline-offset-4"
                >
                  Delete unused {singularLabel.toLowerCase()}
                </button>
              </form>
            )}
          </article>
        ))}

        {!rows.length && (
          <div className="border border-border bg-white p-10 text-center">
            <p className="font-serif text-3xl">No {kind}s yet</p>
          </div>
        )}
      </section>
    </div>
  );
}
