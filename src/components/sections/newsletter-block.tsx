"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterBlock() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    setStatus("success");
  };

  return (
    <section className="bg-black px-4 py-14 text-white min-[390px]:px-5 min-[390px]:py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="eyebrow text-white/60">Private list</p>
          <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight min-[390px]:text-4xl sm:text-5xl">
            New pieces, considered edits, and quiet invitations.
          </h2>
        </div>
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={submit} aria-busy={status === "loading"}>
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            required
            disabled={status !== "idle"}
            placeholder="Email address"
            className="min-h-12 flex-1 border border-white/35 bg-transparent px-4 text-sm outline-none placeholder:text-white/50 focus:border-white disabled:opacity-65"
          />
          <Button
            type="submit"
            loading={status === "loading"}
            loadingLabel="Joining…"
            disabled={status === "success"}
            className="min-w-[150px] border-white bg-white text-black before:bg-off-white"
          >
            {status === "success" ? "You’re on the list" : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}
