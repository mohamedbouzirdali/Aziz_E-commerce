import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/account/auth-form";
import { PageIntro } from "@/components/sections/page-intro";

export const metadata: Metadata = { title: "Reset Password" };

export default function ForgotPasswordPage() {
  return (
    <>
      <PageIntro
        eyebrow="Account recovery"
        title="Reset your password"
        description="Enter your account email and we will send a secure recovery link."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Reset password" },
        ]}
      />
      <div className="page-shell py-12 lg:py-20">
        <div className="mx-auto max-w-lg border border-border bg-white p-6 sm:p-10">
          <p className="eyebrow">Recovery link</p>
          <h2 className="mt-3 font-serif text-4xl">Find your account</h2>
          <p className="mt-4 text-sm leading-6 text-charcoal">
            For privacy, the response is the same whether or not the email is
            registered.
          </p>
          <div className="mt-8">
            <AuthForm mode="forgot-password" />
          </div>
          <Link
            href="/account"
            className="link-underline mt-7 inline-block text-xs text-charcoal"
          >
            Return to sign in
          </Link>
        </div>
      </div>
    </>
  );
}
