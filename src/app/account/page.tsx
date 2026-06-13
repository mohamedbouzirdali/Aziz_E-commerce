import type { Metadata } from "next";
import { AccountAccess } from "@/components/account/account-access";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { PageIntro } from "@/components/sections/page-intro";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { getAuthContext } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Account" };

const noticeMessages: Record<string, string> = {
  "sign-in-required": "Sign in to continue to the admin workspace.",
  "staff-required": "This account does not have staff access.",
  "admin-not-configured":
    "Admin roles will be available after the hosted database migration is applied.",
  "confirmation-failed":
    "That confirmation link is invalid or expired. Request a new one.",
  "password-updated": "Your password was updated successfully.",
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string;
    next?: string;
    notice?: string;
  }>;
}) {
  const auth = await getAuthContext();
  const params = await searchParams;
  const mode = params.mode === "sign-up" ? "sign-up" : "sign-in";
  const next = safeRedirectPath(params.next ?? "/account");
  const notice = params.notice ? noticeMessages[params.notice] : undefined;

  return (
    <>
      <PageIntro
      eyebrow="Client account"
        title={auth ? "Welcome back" : "Your account"}
        description={
          auth
            ? "Manage your ÉLAN access and move between saved pieces and staff tools."
            : "Sign in or create an account for a more considered shopping experience."
        }
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }]}
      />
      <div className="page-shell py-12 lg:py-20">
        {auth ? (
          <AccountDashboard auth={auth} />
        ) : (
          <AccountAccess mode={mode} next={next} notice={notice} />
        )}
      </div>
    </>
  );
}
