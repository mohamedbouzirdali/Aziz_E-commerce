import Link from "next/link";
import { AuthForm } from "./auth-form";

export function AccountAccess({
  mode,
  next,
  notice,
}: {
  mode: "sign-in" | "sign-up";
  next: string;
  notice?: string;
}) {
  return (
    <div className="grid border border-border bg-white lg:grid-cols-[0.78fr_1.22fr]">
      <div className="flex min-h-64 flex-col justify-between bg-black p-7 text-white sm:p-10 lg:min-h-[560px]">
        <p className="eyebrow text-white/55">ÉLAN client account</p>
        <div>
          <h2 className="max-w-sm font-serif text-5xl leading-[0.92] sm:text-6xl">
            Your wardrobe,
            <br />
            <span className="italic">kept close.</span>
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
            Save considered pieces, track access, and return to a calmer shopping
            flow without friction.
          </p>
          <div className="mt-8 grid gap-px bg-white/10">
            {[
              "Saved wishlist across sessions",
              "Staff workspace access when assigned",
              "Password recovery and secure sign-in",
            ].map((item) => (
              <div key={item} className="bg-black/30 px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-white/78">
                {item}
              </div>
            ))}
          </div>
        </div>
        <Link
          href="/shop"
          className="link-underline mt-10 self-start text-[10px] font-semibold uppercase tracking-[0.16em]"
        >
          Continue shopping
        </Link>
      </div>

      <div className="p-6 sm:p-10 lg:p-14">
        <div className="mb-10 flex border-b border-border">
          <Link
            href={`/account?mode=sign-in&next=${encodeURIComponent(next)}`}
            className={`flex-1 border-b-2 px-3 pb-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] ${
              mode === "sign-in"
                ? "border-black text-black"
                : "border-transparent text-charcoal/55"
            }`}
          >
            Sign in
          </Link>
          <Link
            href={`/account?mode=sign-up&next=${encodeURIComponent(next)}`}
            className={`flex-1 border-b-2 px-3 pb-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] ${
              mode === "sign-up"
                ? "border-black text-black"
                : "border-transparent text-charcoal/55"
            }`}
          >
            Create account
          </Link>
        </div>

        <div className="mx-auto max-w-md">
          <p className="eyebrow">
            {mode === "sign-in" ? "Welcome back" : "Join ÉLAN"}
          </p>
          <h3 className="mt-3 font-serif text-4xl">
            {mode === "sign-in" ? "Sign in" : "Create your account"}
          </h3>
          <p className="mt-4 text-sm leading-6 text-charcoal">
            {mode === "sign-in"
              ? "Use the email connected to your account."
              : "Your password needs uppercase, lowercase, a number, and at least 8 characters."}
          </p>

          {notice && (
            <p className="mt-6 border border-black/15 bg-off-white px-4 py-3 text-xs leading-5 text-charcoal">
              {notice}
            </p>
          )}

          <div className="mt-8 rounded-none border border-border bg-off-white/45 p-5 sm:p-6">
            <AuthForm mode={mode} next={next} />
          </div>
        </div>
      </div>
    </div>
  );
}
