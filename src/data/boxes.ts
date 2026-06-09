import type { ProductBox } from "@/lib/types";

export const boxes: ProductBox[] = [
  {
    id: "box-001",
    slug: "modern-workday-box",
    name: "Modern Workday Box",
    description: "A complete tailored foundation for polished weekdays.",
    includedProductIds: ["prod-002", "prod-003", "prod-004"],
    individualTotalPriceTnd: 647,
    boxPriceTnd: 569,
    savingsTnd: 78,
    occasion: "Work",
    placeholderImageLabel: "Three-piece workday capsule",
  },
  {
    id: "box-002",
    slug: "evening-edit-box",
    name: "Evening Edit Box",
    description: "A considered after-dark pairing with one finishing accent.",
    includedProductIds: ["prod-005", "prod-006", "prod-008"],
    individualTotalPriceTnd: 577,
    boxPriceTnd: 499,
    savingsTnd: 78,
    occasion: "Evening",
    placeholderImageLabel: "Evening capsule flat lay",
  },
  {
    id: "box-003",
    slug: "weekend-light-box",
    name: "Weekend Light Box",
    description: "Easy layers for warm afternoons and unhurried plans.",
    includedProductIds: ["prod-001", "prod-006", "prod-007"],
    individualTotalPriceTnd: 627,
    boxPriceTnd: 549,
    savingsTnd: 78,
    occasion: "Weekend",
    placeholderImageLabel: "Weekend wardrobe capsule",
  },
];

export const getBoxBySlug = (slug: string) =>
  boxes.find((box) => box.slug === slug);
