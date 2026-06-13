import type { Metadata } from "next";
import { AuthForm } from "@/components/account/auth-form";
import { PageIntro } from "@/components/sections/page-intro";

export const metadata: Metadata = { title: "Choose New Password" };

export default function ResetPasswordPage() {
  return (
    <>
      <PageIntro
        eyebrow="Account recovery"
        title="Choose a new password"
        description="Use at least 8 characters with uppercase, lowercase, and a number."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "New password" },
        ]}
      />
      <div className="page-shell py-12 lg:py-20">
        <div className="mx-auto max-w-lg border border-border bg-white p-6 sm:p-10">
          <p className="eyebrow">Secure update</p>
          <h2 className="mt-3 font-serif text-4xl">New password</h2>
          <div className="mt-8">
            <AuthForm mode="reset-password" />
          </div>
        </div>
      </div>
    </>
  );
}
