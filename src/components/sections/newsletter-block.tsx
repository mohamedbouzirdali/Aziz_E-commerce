"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterBlock({
  eyebrow = "Newsletter",
  heading = "Rejoignez le rituel.",
  body,
}: {
  eyebrow?: string;
  heading?: string;
  body?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setStatus("success");
  };

  return (
    <section className="bg-transparent px-5 py-10 min-[390px]:px-6 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10">
        <div>
          <p className="eyebrow text-black/50">{eyebrow}</p>
          <h2 className="mt-3 max-w-lg font-serif text-3xl leading-tight text-black min-[390px]:text-4xl sm:text-[3rem] lg:text-[3.2rem]">
            {heading}
          </h2>
          {body && (
            <p className="mt-4 max-w-xl text-sm leading-7 text-black/62">
              {body}
            </p>
          )}
        </div>
        <form
          className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start"
          onSubmit={submit}
          aria-busy={status === "loading"}
        >
          <label htmlFor="newsletter-email" className="sr-only">Adresse e-mail</label>
          <div>
            <input
              id="newsletter-email"
              type="email"
              required
              disabled={status !== "idle"}
              placeholder="Entrez votre e-mail"
              className="min-h-12 w-full border border-black/10 bg-white/85 px-4 text-sm text-black outline-none placeholder:text-black/38 focus:border-black disabled:opacity-65"
            />
            <p className="mt-3 text-[11px] leading-5 text-black/42">
              En vous inscrivant, vous acceptez notre politique de confidentialité et nos conditions.
            </p>
          </div>
          <Button
            type="submit"
            loading={status === "loading"}
            loadingLabel="Inscription…"
            disabled={status === "success"}
            className="min-w-[170px] border-[#1e1e1e] bg-[#1e1e1e] text-[#f8f5ef] before:bg-[#343434] hover:border-[#343434] md:self-start"
          >
            {status === "success" ? "Vous êtes inscrite" : "Rejoindre evoflex"}
          </Button>
        </form>
      </div>
    </section>
  );
}
