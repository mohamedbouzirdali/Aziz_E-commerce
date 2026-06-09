import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <PlaceholderPage
      eyebrow="Client account"
      title="Welcome"
      description="Account structure is reserved, while authentication remains intentionally outside the MVP architecture phase."
    >
      <div className="mx-auto max-w-md border border-border p-6 sm:p-8">
        <p className="eyebrow">Account access</p>
        <h2 className="mt-3 font-serif text-3xl">Sign in later</h2>
        <p className="mt-4 text-sm leading-6 text-charcoal">
          Order history, saved details, and authentication will be introduced only when a backend is selected.
        </p>
        <Button disabled className="mt-7 w-full">Sign in unavailable</Button>
      </div>
    </PlaceholderPage>
  );
}
