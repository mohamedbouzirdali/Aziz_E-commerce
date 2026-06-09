import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/sections/placeholder-page";
import { Accordion } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about Élan sizing, delivery in Tunisia, returns, and the shopping experience.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <PlaceholderPage
      eyebrow="Client care"
      title="Frequently asked questions"
      description="A concise home for the practical details customers need before and after purchasing."
    >
      <div className="mx-auto max-w-3xl border-t border-border">
        <Accordion title="Where do you deliver?" defaultOpen>
          The MVP is prepared for delivery across Tunisia. Final regions, fees, and timing will be confirmed before launch.
        </Accordion>
        <Accordion title="How do I choose my size?">
          Product pages expose a size guide entry point and unavailable options. Final measurements will follow the product catalog.
        </Accordion>
        <Accordion title="Can I return an item?">
          The mock catalog uses a 14-day return window. Final policy language requires operational approval.
        </Accordion>
      </div>
    </PlaceholderPage>
  );
}
