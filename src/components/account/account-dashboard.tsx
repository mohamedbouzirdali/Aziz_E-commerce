import { signOutAction } from "@/app/account/actions";
import { Button } from "@/components/ui/button";
import type { AuthContext } from "@/lib/auth/session";

export function AccountDashboard({ auth }: { auth: AuthContext }) {
  const accountStatus = auth.isStaff ? "Staff access enabled" : "Client account";
  const roleLabels = auth.roles.length ? auth.roles : ["customer"];

  return (
    <div className="overflow-hidden border border-border bg-border">
      <section className="grid gap-px lg:grid-cols-[1.3fr_0.7fr]">
        <div className="bg-white p-7 sm:p-10">
          <p className="eyebrow">Signed in</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-4xl sm:text-5xl">Your ÉLAN account</h2>
            <span className="border border-black/15 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]">
              {accountStatus}
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-charcoal">
            {auth.email ?? "Authenticated client"}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {roleLabels.map((role) => (
              <span
                key={role}
                className="border border-border bg-off-white px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em]"
              >
                {role}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2">
            {[
              ["Saved pieces", "Wishlist stays available across this device and session."],
              ["Order history", "Orders will surface here when checkout is introduced."],
              ["Delivery details", "Saved addresses are prepared for the next commerce phase."],
              ["Account preferences", "Profile and notification controls are ready to expand next."],
            ].map(([title, description]) => (
              <div key={title} className="bg-off-white p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                  {title}
                </p>
                <p className="mt-3 text-xs leading-6 text-charcoal">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col justify-between bg-black p-7 text-white sm:p-10">
          <div>
            <p className="eyebrow text-white/50">Account actions</p>
            <h3 className="mt-4 font-serif text-3xl leading-tight">
              Move between your saved pieces and live store tools.
            </h3>
            <div className="mt-8 flex flex-col gap-3">
              <Button href="/wishlist" variant="secondary" className="w-full border-white bg-white text-black before:bg-off-white">
                View wishlist
              </Button>
              <Button href="/shop" variant="ghost" className="w-full justify-between text-white">
                Continue shopping
              </Button>
              {auth.isStaff && (
                <Button href="/admin" variant="ghost" className="w-full justify-between text-white">
                  Open admin workspace
                </Button>
              )}
            </div>
          </div>

          <div className="mt-10">
            {!auth.roleLookupAvailable && (
              <p className="mb-5 border border-white/15 bg-white/5 p-4 text-xs leading-5 text-white/72">
                Account access is active. Staff roles become available after the
                hosted database migration is applied.
              </p>
            )}

            <form action={signOutAction}>
              <Button
                type="submit"
                variant="secondary"
                loadingLabel="Signing out..."
                className="w-full border-white bg-transparent text-white before:bg-white hover:text-black"
              >
                Sign out
              </Button>
            </form>
          </div>
        </aside>
      </section>
    </div>
  );
}
