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
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=82",
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
    imageUrl:
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&w=1600&q=82",
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
    imageUrl:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=82",
  },
];

export const getBoxBySlug = (slug: string) =>
  boxes.find((box) => box.slug === slug);
