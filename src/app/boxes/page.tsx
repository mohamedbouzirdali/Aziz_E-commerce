import type { Metadata } from "next";
import { BoxCard } from "@/components/cards/box-card";
import { PageIntro } from "@/components/sections/page-intro";
import { boxes } from "@/data";

export const metadata: Metadata = {
  title: "L’édit box",
  description: "Explorez des capsules vestiaires complètes pour femme avec avantage réfléchi et intention de style claire.",
  alternates: { canonical: "/boxes" },
};

export default function BoxesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Capsules sélectionnées"
        title="L’édit box"
        description="Des silhouettes complètes pour un moment donné, pensées pour fonctionner ensemble. Chaque box inclut un avantage réfléchi."
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Coffrets" }]}
      />
      <div className="page-shell grid gap-10 py-10 min-[390px]:gap-14 min-[390px]:py-12 lg:grid-cols-2 lg:py-20">
        {boxes.map((box) => <BoxCard key={box.id} box={box} />)}
      </div>
    </>
  );
}
