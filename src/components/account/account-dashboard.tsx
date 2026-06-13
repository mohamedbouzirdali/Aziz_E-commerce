import Link from "next/link";
import { signOutAction } from "@/app/account/actions";
import { Button } from "@/components/ui/button";
import type { AuthContext } from "@/lib/auth/session";

export function AccountDashboard({ auth }: { auth: AuthContext }) {
  return (
    <div className="grid gap-px border border-border bg-border lg:grid-cols-[1.2fr_0.8fr]">
      <section className="bg-white p-7 sm:p-10">
        <p className="eyebrow">Signed in</p>
        <h2 className="mt-4 font-serif text-4xl">Your ÉLAN account</h2>
        <p className="mt-4 text-sm leading-6 text-charcoal">
          {auth.email ?? "Authenticated client"}
        </p>

        <div className="mt-10 grid gap-px bg-border sm:grid-cols-2">
          {[
            ["Saved pieces", "Your wishlist remains available across this device."],
            ["Order history", "Orders will appear here when checkout is introduced."],
            ["Delivery details", "Saved addresses arrive with the checkout phase."],
            ["Preferences", "Email and profile controls are prepared for the next phase."],
          ].map(([title, description]) => (
            <div key={title} className="bg-off-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                {title}
              </p>
              <p className="mt-3 text-xs leading-5 text-charcoal">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <aside className="flex flex-col justify-between bg-off-white p-7 sm:p-10">
        <div>
          <p className="eyebrow">Account actions</p>
          <div className="mt-6 flex flex-col items-start gap-5">
            <Link className="link-underline text-sm" href="/wishlist">
              View wishlist
            </Link>
            <Link className="link-underline text-sm" href="/shop">
              Continue shopping
            </Link>
            {auth.isStaff && (
              <Link className="link-underline text-sm" href="/admin">
                Open admin workspace
              </Link>
            )}
          </div>
        </div>

        {!auth.roleLookupAvailable && (
          <p className="mt-10 border border-black/15 bg-white p-4 text-xs leading-5 text-charcoal">
            Account access is active. Staff roles will become available after the
            hosted database migration is applied.
          </p>
        )}

        <form action={signOutAction} className="mt-10">
          <Button type="submit" variant="secondary" className="w-full">
            Sign out
          </Button>
        </form>
      </aside>
    </div>
  );
}
