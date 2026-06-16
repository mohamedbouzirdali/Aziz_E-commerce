import type { ProductBox } from "@/lib/types";

export const boxes: ProductBox[] = [
  {
    id: "box-001",
    slug: "modern-workday-box",
    name: "Box journée moderne",
    description: "Une base tailleur complète pour des journées impeccables.",
    includedProductIds: ["prod-002", "prod-003", "prod-004"],
    individualTotalPriceTnd: 647,
    boxPriceTnd: 569,
    savingsTnd: 78,
    occasion: "Travail",
    placeholderImageLabel: "Capsule trois pièces pour la journée",
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=82",
  },
  {
    id: "box-002",
    slug: "evening-edit-box",
    name: "Box édit du soir",
    description: "Une silhouette pensée pour le soir, complétée par un accent final.",
    includedProductIds: ["prod-005", "prod-006", "prod-008"],
    individualTotalPriceTnd: 577,
    boxPriceTnd: 499,
    savingsTnd: 78,
    occasion: "Soirée",
    placeholderImageLabel: "Capsule du soir en flat lay",
    imageUrl:
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&w=1600&q=82",
  },
  {
    id: "box-003",
    slug: "weekend-light-box",
    name: "Box week-end léger",
    description: "Des couches faciles pour les après-midis doux et les plans sans hâte.",
    includedProductIds: ["prod-001", "prod-006", "prod-007"],
    individualTotalPriceTnd: 627,
    boxPriceTnd: 549,
    savingsTnd: 78,
    occasion: "Week-end",
    placeholderImageLabel: "Capsule garde-robe du week-end",
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=82",
  },
];

export const getBoxBySlug = (slug: string) =>
  boxes.find((box) => box.slug === slug);
