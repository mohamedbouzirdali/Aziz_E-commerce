import type { Metadata } from "next";
import { BoxCard } from "@/components/cards/box-card";
import { PageIntro } from "@/components/sections/page-intro";
import { boxes } from "@/data";

export const metadata: Metadata = {
  title: "The Box Edit",
  description: "Explore complete women’s wardrobe capsules with considered savings and clear styling purpose.",
  alternates: { canonical: "/boxes" },
};

export default function BoxesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Curated capsules"
        title="The Box Edit"
        description="Complete wardrobes for a moment, selected to work together. Each box includes a considered saving."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Boxes" }]}
      />
      <div className="page-shell grid gap-10 py-10 min-[390px]:gap-14 min-[390px]:py-12 lg:grid-cols-2 lg:py-20">
        {boxes.map((box) => <BoxCard key={box.id} box={box} />)}
      </div>
    </>
  );
}
