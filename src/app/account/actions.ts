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
    fieldErrors.email = "Saisissez une adresse e-mail valide.";
  }

  if (!password) {
    fieldErrors.password = "Saisissez votre mot de passe.";
  }

  if (Object.keys(fieldErrors).length) {
    return { status: "error", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      status: "error",
      message: "Impossible de vous connecter avec ces informations.",
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
    fieldErrors.firstName = "Saisissez au moins 2 caractères.";
  }

  if (lastName.length < 2) {
    fieldErrors.lastName = "Saisissez au moins 2 caractères.";
  }

  if (!validateEmail(email)) {
    fieldErrors.email = "Saisissez une adresse e-mail valide.";
  }

  if (!validatePassword(password)) {
    fieldErrors.password =
      "Utilisez 8 caractères ou plus avec une majuscule, une minuscule et un chiffre.";
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
      message: "Impossible de créer le compte. Vérifiez vos informations puis réessayez.",
    };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/account");
  }

  return {
    status: "success",
    message: "Vérifiez votre e-mail pour confirmer votre compte evoflex.",
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
      fieldErrors: { email: "Saisissez une adresse e-mail valide." },
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
      message: "Impossible d’envoyer le lien de réinitialisation. Réessayez.",
    };
  }

  return {
    status: "success",
    message: "Si un compte existe pour cet e-mail, un lien de réinitialisation est en route.",
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
        password: "Utilisez 8 caractères ou plus avec une majuscule, une minuscule et un chiffre.",
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      status: "error",
      message: "Votre session de réinitialisation a expiré. Demandez un nouveau lien.",
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
