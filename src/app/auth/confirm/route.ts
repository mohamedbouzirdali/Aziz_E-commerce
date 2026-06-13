import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

const emailOtpTypes = new Set<EmailOtpType>([
  "email",
  "recovery",
  "invite",
  "email_change",
  "signup",
  "magiclink",
]);

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const next = safeRedirectPath(request.nextUrl.searchParams.get("next"));
  const redirectUrl = request.nextUrl.clone();
  const supabase = await createClient();

  function redirectToNext() {
    const target = new URL(next, redirectUrl);
    redirectUrl.pathname = target.pathname;
    redirectUrl.search = target.search;
    redirectUrl.hash = target.hash;
    return NextResponse.redirect(redirectUrl);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return redirectToNext();
    }
  } else if (tokenHash && type && emailOtpTypes.has(type)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!error) {
      return redirectToNext();
    }
  }

  redirectUrl.pathname = "/account";
  redirectUrl.search = "?notice=confirmation-failed";
  return NextResponse.redirect(redirectUrl);
}
