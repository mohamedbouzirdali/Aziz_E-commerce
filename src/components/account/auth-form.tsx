"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestPasswordResetAction,
  signInAction,
  signUpAction,
  updatePasswordAction,
} from "@/app/account/actions";
import { Button } from "@/components/ui/button";
import {
  initialAuthFormState,
  type AuthFormState,
} from "@/lib/auth/forms";

type AuthMode = "sign-in" | "sign-up" | "forgot-password" | "reset-password";

const fieldsByMode: Record<
  AuthMode,
  Array<{
    name: "firstName" | "lastName" | "email" | "password";
    label: string;
    type: "text" | "email" | "password";
    autoComplete: string;
  }>
> = {
  "sign-in": [
    { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
    {
      name: "password",
      label: "Mot de passe",
      type: "password",
      autoComplete: "current-password",
    },
  ],
  "sign-up": [
    {
      name: "firstName",
      label: "Prénom",
      type: "text",
      autoComplete: "given-name",
    },
    {
      name: "lastName",
      label: "Nom",
      type: "text",
      autoComplete: "family-name",
    },
    { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
    {
      name: "password",
      label: "Mot de passe",
      type: "password",
      autoComplete: "new-password",
    },
  ],
  "forgot-password": [
    { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
  ],
  "reset-password": [
    {
      name: "password",
      label: "Nouveau mot de passe",
      type: "password",
      autoComplete: "new-password",
    },
  ],
};

const actionByMode = {
  "sign-in": signInAction,
  "sign-up": signUpAction,
  "forgot-password": requestPasswordResetAction,
  "reset-password": updatePasswordAction,
};

const submitLabelByMode = {
  "sign-in": "Se connecter",
  "sign-up": "Créer un compte",
  "forgot-password": "Envoyer le lien",
  "reset-password": "Mettre à jour le mot de passe",
};

const loadingLabelByMode = {
  "sign-in": "Connexion",
  "sign-up": "Création du compte",
  "forgot-password": "Envoi du lien",
  "reset-password": "Mise à jour",
};

export function AuthForm({
  mode,
  next = "/account",
}: {
  mode: AuthMode;
  next?: string;
}) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    actionByMode[mode],
    initialAuthFormState,
  );

  return (
    <form action={formAction} className="space-y-5" aria-busy={pending}>
      {mode === "sign-in" && <input type="hidden" name="next" value={next} />}

      {fieldsByMode[mode].map((field) => (
        <div key={field.name}>
          <label
            htmlFor={`${mode}-${field.name}`}
            className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          >
            {field.label}
          </label>
          <input
            id={`${mode}-${field.name}`}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            required
            aria-invalid={Boolean(state.fieldErrors?.[field.name])}
            aria-describedby={
              state.fieldErrors?.[field.name]
                ? `${mode}-${field.name}-error`
                : undefined
            }
            className="mt-2 min-h-12 w-full border border-border bg-white px-4 text-sm outline-none transition-colors focus:border-black"
          />
          {state.fieldErrors?.[field.name] && (
            <p
              id={`${mode}-${field.name}-error`}
              className="mt-2 text-xs leading-5 text-red-800"
            >
              {state.fieldErrors[field.name]}
            </p>
          )}
        </div>
      ))}

      {state.message && (
        <p
          aria-live="polite"
          className={`border px-4 py-3 text-xs leading-5 ${
            state.status === "success"
              ? "border-black/20 bg-off-white text-charcoal"
              : "border-red-900/20 bg-red-50 text-red-900"
          }`}
        >
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        loading={pending}
        loadingLabel={loadingLabelByMode[mode]}
        className="w-full"
      >
        {submitLabelByMode[mode]}
      </Button>

      {mode === "sign-in" && (
        <div className="flex flex-wrap justify-between gap-4 text-xs text-charcoal">
          <Link className="link-underline" href="/account/forgot-password">
            Mot de passe oublié
          </Link>
          <Link className="link-underline" href="/account?mode=sign-up">
            Créer un compte
          </Link>
        </div>
      )}
    </form>
  );
}
