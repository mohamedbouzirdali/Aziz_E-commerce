"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { AuthFormState } from "@/lib/auth/forms";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string) {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  );
}

async function requestOrigin() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");

  if (origin) {
    return new URL(origin).origin;
  }

  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";

  return host ? `${protocol}://${host}` : "http://localhost:3000";
}

export async function signInAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = value(formData, "email").toLowerCase();
  const password = value(formData, "password");
  const next = safeRedirectPath(formData.get("next"));
  const fieldErrors: AuthFormState["fieldErrors"] = {};

  if (!validateEmail(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!password) {
    fieldErrors.password = "Enter your password.";
  }

  if (Object.keys(fieldErrors).length) {
    return { status: "error", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      status: "error",
      message: "We could not sign you in with those details.",
    };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUpAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const firstName = value(formData, "firstName");
  const lastName = value(formData, "lastName");
  const email = value(formData, "email").toLowerCase();
  const password = value(formData, "password");
  const fieldErrors: AuthFormState["fieldErrors"] = {};

  if (firstName.length < 2) {
    fieldErrors.firstName = "Enter at least 2 characters.";
  }

  if (lastName.length < 2) {
    fieldErrors.lastName = "Enter at least 2 characters.";
  }

  if (!validateEmail(email)) {
    fieldErrors.email = "Enter a valid email address.";
  }

  if (!validatePassword(password)) {
    fieldErrors.password =
      "Use 8+ characters with uppercase, lowercase, and a number.";
  }

  if (Object.keys(fieldErrors).length) {
    return { status: "error", fieldErrors };
  }

  const supabase = await createClient();
  const origin = await requestOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
      emailRedirectTo: `${origin}/auth/confirm?next=/account`,
    },
  });

  if (error) {
    return {
      status: "error",
      message: "We could not create the account. Review your details and try again.",
    };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/account");
  }

  return {
    status: "success",
    message: "Check your email to confirm your ÉLAN account.",
  };
}

export async function requestPasswordResetAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = value(formData, "email").toLowerCase();

  if (!validateEmail(email)) {
    return {
      status: "error",
      fieldErrors: { email: "Enter a valid email address." },
    };
  }

  const supabase = await createClient();
  const origin = await requestOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/account/reset-password`,
  });

  if (error) {
    return {
      status: "error",
      message: "We could not send a reset link. Please try again.",
    };
  }

  return {
    status: "success",
    message: "If an account exists for this email, a reset link is on its way.",
  };
}

export async function updatePasswordAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const password = value(formData, "password");

  if (!validatePassword(password)) {
    return {
      status: "error",
      fieldErrors: {
        password: "Use 8+ characters with uppercase, lowercase, and a number.",
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      status: "error",
      message: "Your reset session expired. Request a new password link.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/account?notice=password-updated");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
