import type { Product } from "@/lib/types";
import { colors as palette } from "./colors";

const productImageMap: Record<string, Partial<Record<string, string>>> = {
  "sculpted-midi-dress": {
    black:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=82",
    ivory:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=82",
  },
  "relaxed-linen-blazer": {
    charcoal:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=82",
    stone:
      "https://images.unsplash.com/photo-1506629905607-c52b1ea7d3f6?auto=format&fit=crop&w=1400&q=82",
  },
  "fluid-wide-leg-trousers": {
    black:
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&w=1400&q=82",
    stone:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=82",
  },
  "draped-neck-top": {
    ivory:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=82",
    burgundy:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=82",
    black:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=82",
  },
  "column-knit-dress": {
    black:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=82",
    burgundy:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=82",
  },
  "minimal-shoulder-bag": {
    black:
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&w=1400&q=82",
    stone:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=82",
  },
  "soft-tailored-waistcoat": {
    ivory:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=82",
    charcoal:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=82",
  },
  "asymmetric-satin-skirt": {
    black:
      "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&w=1400&q=82",
    burgundy:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=82",
  },
};

function productColors(
  ids: string[],
  productName: string,
  imageUrls: Partial<Record<string, string>> = {},
) {
  return ids.map((id) => {
    const color = palette.find((item) => item.id === id);
    if (!color) throw new Error(`Unknown product color: ${id}`);
    return {
      ...color,
      imagePlaceholderLabel: `${productName} — ${color.name} view`,
      imageUrl: imageUrls[id],
    };
  });
}

const shared = {
  delivery: "Delivery across Tunisia in 2-5 business days.",
  returns: "Returns accepted within 14 days in original condition.",
  care: "Follow the care label. Store in a cool, dry place.",
};

export const products: Product[] = [
  {
    id: "prod-001",
    slug: "sculpted-midi-dress",
    name: "Sculpted Midi Dress",
    description: "A softly structured midi dress with a defined waist and fluid skirt.",
    priceTnd: 289,
    category: "dresses",
    collection: "new-form",
    colors: productColors(
      ["black", "ivory"],
      "Sculpted Midi Dress",
      productImageMap["sculpted-midi-dress"],
    ),
    defaultColor: "black",
    sizes: ["xs", "s", "m", "l"],
    unavailableSizes: ["xs"],
    badges: ["New"],
    isNew: true,
    isBestSeller: false,
    availability: "in-stock",
    placeholderImageLabel: "Model wearing sculpted midi dress",
    imageRatio: "portrait",
    details: "Midi length, concealed back zip, lightly shaped bodice.",
    composition: "72% viscose, 28% linen.",
    fit: "Fitted through the bodice with a relaxed skirt.",
    ...shared,
  },
  {
    id: "prod-002",
    slug: "relaxed-linen-blazer",
    name: "Relaxed Linen Blazer",
    description: "Single-breasted tailoring with a relaxed shoulder and clean finish.",
    priceTnd: 329,
    category: "tailoring",
    collection: "new-form",
    colors: productColors(
      ["charcoal", "stone"],
      "Relaxed Linen Blazer",
      productImageMap["relaxed-linen-blazer"],
    ),
    defaultColor: "charcoal",
    sizes: ["xs", "s", "m", "l", "xl"],
    unavailableSizes: ["xl"],
    badges: ["Best Seller"],
    isNew: false,
    isBestSeller: true,
    availability: "low-stock",
    placeholderImageLabel: "Relaxed linen blazer campaign",
    imageRatio: "portrait",
    details: "Notched lapels, single-button closure, two front pockets.",
    composition: "55% linen, 45% viscose.",
    fit: "Relaxed fit. Choose your usual size.",
    ...shared,
  },
  {
    id: "prod-003",
    slug: "fluid-wide-leg-trousers",
    name: "Fluid Wide-Leg Trousers",
    description: "High-rise trousers with precise pleats and an elongated silhouette.",
    priceTnd: 189,
    category: "bottoms",
    collection: "everyday-edit",
    colors: productColors(
      ["black", "stone"],
      "Fluid Wide-Leg Trousers",
      productImageMap["fluid-wide-leg-trousers"],
    ),
    defaultColor: "black",
    sizes: ["xs", "s", "m", "l", "xl"],
    unavailableSizes: [],
    badges: [],
    isNew: false,
    isBestSeller: true,
    availability: "in-stock",
    placeholderImageLabel: "Wide-leg trouser detail",
    imageRatio: "portrait",
    details: "High rise, front pleats, side pockets, full length.",
    composition: "64% recycled polyester, 33% viscose, 3% elastane.",
    fit: "Regular waist with a generous wide leg.",
    ...shared,
  },
  {
    id: "prod-004",
    slug: "draped-neck-top",
    name: "Draped-Neck Top",
    description: "A refined sleeveless top with a softly draped neckline.",
    priceTnd: 129,
    category: "tops",
    collection: "after-dark",
    colors: productColors(
      ["ivory", "burgundy", "black"],
      "Draped-Neck Top",
      productImageMap["draped-neck-top"],
    ),
    defaultColor: "ivory",
    sizes: ["xs", "s", "m", "l"],
    unavailableSizes: ["l"],
    badges: ["New"],
    isNew: true,
    isBestSeller: false,
    availability: "in-stock",
    placeholderImageLabel: "Draped top studio view",
    imageRatio: "portrait",
    details: "Sleeveless, draped neckline, straight hem.",
    composition: "100% viscose.",
    fit: "Skims the body without clinging.",
    ...shared,
  },
  {
    id: "prod-005",
    slug: "column-knit-dress",
    name: "Column Knit Dress",
    description: "A long ribbed silhouette balanced by a clean square neckline.",
    priceTnd: 249,
    category: "dresses",
    collection: "after-dark",
    colors: productColors(
      ["black", "burgundy"],
      "Column Knit Dress",
      productImageMap["column-knit-dress"],
    ),
    defaultColor: "black",
    sizes: ["xs", "s", "m", "l"],
    unavailableSizes: ["s"],
    badges: ["Limited"],
    isNew: false,
    isBestSeller: true,
    availability: "low-stock",
    placeholderImageLabel: "Column dress movement study",
    imageRatio: "portrait",
    details: "Maxi length, square neck, fine rib knit.",
    composition: "70% viscose, 30% recycled polyamide.",
    fit: "Close fit with comfortable stretch.",
    ...shared,
  },
  {
    id: "prod-006",
    slug: "minimal-shoulder-bag",
    name: "Minimal Shoulder Bag",
    description: "A compact everyday bag with a curved profile and discreet closure.",
    priceTnd: 159,
    category: "accessories",
    collection: "everyday-edit",
    colors: productColors(
      ["black", "stone"],
      "Minimal Shoulder Bag",
      productImageMap["minimal-shoulder-bag"],
    ),
    defaultColor: "black",
    sizes: ["one-size"],
    unavailableSizes: [],
    badges: [],
    isNew: true,
    isBestSeller: false,
    availability: "in-stock",
    placeholderImageLabel: "Shoulder bag still life",
    imageRatio: "portrait",
    details: "Adjustable strap, magnetic closure, internal slip pocket.",
    composition: "Recycled polyurethane outer, cotton lining.",
    fit: "Width 26 cm, height 15 cm, depth 8 cm.",
    ...shared,
  },
  {
    id: "prod-007",
    slug: "soft-tailored-waistcoat",
    name: "Soft Tailored Waistcoat",
    description: "Longline waistcoat with subtle shaping and covered buttons.",
    priceTnd: 179,
    category: "tailoring",
    collection: "new-form",
    colors: productColors(
      ["ivory", "charcoal"],
      "Soft Tailored Waistcoat",
      productImageMap["soft-tailored-waistcoat"],
    ),
    defaultColor: "ivory",
    sizes: ["xs", "s", "m", "l"],
    unavailableSizes: [],
    badges: ["New"],
    isNew: true,
    isBestSeller: false,
    availability: "in-stock",
    placeholderImageLabel: "Tailored waistcoat front view",
    imageRatio: "portrait",
    details: "V-neck, covered buttons, welt pockets.",
    composition: "68% viscose, 28% linen, 4% elastane.",
    fit: "Longline, lightly fitted silhouette.",
    ...shared,
  },
  {
    id: "prod-008",
    slug: "asymmetric-satin-skirt",
    name: "Asymmetric Satin Skirt",
    description: "A fluid satin skirt cut on the bias with an asymmetric hem.",
    priceTnd: 169,
    category: "bottoms",
    collection: "after-dark",
    colors: productColors(
      ["black", "burgundy"],
      "Asymmetric Satin Skirt",
      productImageMap["asymmetric-satin-skirt"],
    ),
    defaultColor: "black",
    sizes: ["xs", "s", "m", "l", "xl"],
    unavailableSizes: ["xs", "xl"],
    badges: [],
    isNew: false,
    isBestSeller: false,
    availability: "in-stock",
    placeholderImageLabel: "Satin skirt movement detail",
    imageRatio: "portrait",
    details: "Bias cut, concealed side zip, asymmetric midi hem.",
    composition: "100% recycled polyester.",
    fit: "Regular waist with a fluid fit.",
    ...shared,
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);
