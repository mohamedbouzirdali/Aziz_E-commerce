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
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=82",
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
      imagePlaceholderLabel: `${productName} — vue ${color.name}`,
      imageUrl: imageUrls[id],
    };
  });
}

const shared = {
  delivery: "Livraison en Tunisie sous 2 à 5 jours ouvrés.",
  returns: "Retours acceptés sous 14 jours, dans l'état d'origine.",
  care: "Suivez les instructions d'entretien. Conservez dans un endroit frais et sec.",
};

export const products: Product[] = [
  {
    id: "prod-001",
    slug: "sculpted-midi-dress",
    name: "Robe midi sculptée",
    description: "Une robe midi à la structure souple, avec taille définie et jupe fluide.",
    priceTnd: 289,
    category: "dresses",
    collection: "new-form",
    colors: productColors(
      ["black", "ivory"],
      "Robe midi sculptée",
      productImageMap["sculpted-midi-dress"],
    ),
    defaultColor: "black",
    sizes: ["xs", "s", "m", "l"],
    unavailableSizes: ["xs"],
    badges: ["Nouveau"],
    isNew: true,
    isBestSeller: false,
    availability: "in-stock",
    placeholderImageLabel: "Mannequin portant une robe midi sculptée",
    imageRatio: "portrait",
    details: "Longueur midi, zip dos invisible, corsage légèrement structuré.",
    composition: "72% viscose, 28% linen.",
    fit: "Ajustée au niveau du buste avec une jupe souple.",
    ...shared,
  },
  {
    id: "prod-002",
    slug: "relaxed-linen-blazer",
    name: "Blazer en lin souple",
    description: "Un tailleur croisé simple, avec épaule décontractée et finitions nettes.",
    priceTnd: 329,
    category: "tailoring",
    collection: "new-form",
    colors: productColors(
      ["charcoal", "stone"],
      "Blazer en lin souple",
      productImageMap["relaxed-linen-blazer"],
    ),
    defaultColor: "charcoal",
    sizes: ["xs", "s", "m", "l", "xl"],
    unavailableSizes: ["xl"],
    badges: ["Meilleure vente"],
    isNew: false,
    isBestSeller: true,
    availability: "low-stock",
    placeholderImageLabel: "Campagne blazer en lin souple",
    imageRatio: "portrait",
    details: "Revers crantés, fermeture à un bouton, deux poches devant.",
    composition: "55% linen, 45% viscose.",
    fit: "Coupe souple. Prenez votre taille habituelle.",
    ...shared,
  },
  {
    id: "prod-003",
    slug: "fluid-wide-leg-trousers",
    name: "Pantalon fluide à jambe large",
    description: "Un pantalon taille haute à plis précis et silhouette allongée.",
    priceTnd: 189,
    category: "bottoms",
    collection: "everyday-edit",
    colors: productColors(
      ["black", "stone"],
      "Pantalon fluide à jambe large",
      productImageMap["fluid-wide-leg-trousers"],
    ),
    defaultColor: "black",
    sizes: ["xs", "s", "m", "l", "xl"],
    unavailableSizes: [],
    badges: [],
    isNew: false,
    isBestSeller: true,
    availability: "in-stock",
    placeholderImageLabel: "Détail pantalon jambe large",
    imageRatio: "portrait",
    details: "Taille haute, plis devant, poches latérales, pleine longueur.",
    composition: "64% recycled polyester, 33% viscose, 3% elastane.",
    fit: "Taille régulière avec une jambe ample.",
    ...shared,
  },
  {
    id: "prod-004",
    slug: "draped-neck-top",
    name: "Haut à col drapé",
    description: "Un haut sans manches raffiné avec une encolure délicatement drapée.",
    priceTnd: 129,
    category: "tops",
    collection: "after-dark",
    colors: productColors(
      ["ivory", "burgundy", "black"],
      "Haut à col drapé",
      productImageMap["draped-neck-top"],
    ),
    defaultColor: "ivory",
    sizes: ["xs", "s", "m", "l"],
    unavailableSizes: ["l"],
    badges: ["Nouveau"],
    isNew: true,
    isBestSeller: false,
    availability: "in-stock",
    placeholderImageLabel: "Vue studio du haut drapé",
    imageRatio: "portrait",
    details: "Sans manches, col drapé, ourlet droit.",
    composition: "100% viscose.",
    fit: "Épouse le corps sans coller.",
    ...shared,
  },
  {
    id: "prod-005",
    slug: "column-knit-dress",
    name: "Robe maille colonne",
    description: "Une silhouette longue en maille côtelée, équilibrée par une encolure carrée nette.",
    priceTnd: 249,
    category: "dresses",
    collection: "after-dark",
    colors: productColors(
      ["black", "burgundy"],
      "Robe maille colonne",
      productImageMap["column-knit-dress"],
    ),
    defaultColor: "black",
    sizes: ["xs", "s", "m", "l"],
    unavailableSizes: ["s"],
    badges: ["Édition limitée"],
    isNew: false,
    isBestSeller: true,
    availability: "low-stock",
    placeholderImageLabel: "Étude de mouvement robe colonne",
    imageRatio: "portrait",
    details: "Longueur maxi, col carré, fine maille côtelée.",
    composition: "70% viscose, 30% recycled polyamide.",
    fit: "Coupe près du corps avec stretch confortable.",
    ...shared,
  },
  {
    id: "prod-006",
    slug: "minimal-shoulder-bag",
    name: "Sac épaule minimal",
    description: "Un sac compact du quotidien, à la ligne courbe et fermeture discrète.",
    priceTnd: 159,
    category: "accessories",
    collection: "everyday-edit",
    colors: productColors(
      ["black", "stone"],
      "Sac épaule minimal",
      productImageMap["minimal-shoulder-bag"],
    ),
    defaultColor: "black",
    sizes: ["one-size"],
    unavailableSizes: [],
    badges: [],
    isNew: true,
    isBestSeller: false,
    availability: "in-stock",
    placeholderImageLabel: "Nature morte sac épaule",
    imageRatio: "portrait",
    details: "Bandoulière ajustable, fermeture aimantée, poche intérieure plaquée.",
    composition: "Extérieur en polyuréthane recyclé, doublure en coton.",
    fit: "Largeur 26 cm, hauteur 15 cm, profondeur 8 cm.",
    ...shared,
  },
  {
    id: "prod-007",
    slug: "soft-tailored-waistcoat",
    name: "Gilet tailleur souple",
    description: "Un gilet long à la coupe subtilement dessinée et boutons recouverts.",
    priceTnd: 179,
    category: "tailoring",
    collection: "new-form",
    colors: productColors(
      ["ivory", "charcoal"],
      "Gilet tailleur souple",
      productImageMap["soft-tailored-waistcoat"],
    ),
    defaultColor: "ivory",
    sizes: ["xs", "s", "m", "l"],
    unavailableSizes: [],
    badges: ["Nouveau"],
    isNew: true,
    isBestSeller: false,
    availability: "in-stock",
    placeholderImageLabel: "Vue de face gilet tailleur",
    imageRatio: "portrait",
    details: "Col V, boutons recouverts, poches passepoilées.",
    composition: "68% viscose, 28% linen, 4% elastane.",
    fit: "Silhouette longue et légèrement ajustée.",
    ...shared,
  },
  {
    id: "prod-008",
    slug: "asymmetric-satin-skirt",
    name: "Jupe satin asymétrique",
    description: "Une jupe satinée fluide coupée dans le biais, avec ourlet asymétrique.",
    priceTnd: 169,
    category: "bottoms",
    collection: "after-dark",
    colors: productColors(
      ["black", "burgundy"],
      "Jupe satin asymétrique",
      productImageMap["asymmetric-satin-skirt"],
    ),
    defaultColor: "black",
    sizes: ["xs", "s", "m", "l", "xl"],
    unavailableSizes: ["xs", "xl"],
    badges: [],
    isNew: false,
    isBestSeller: false,
    availability: "in-stock",
    placeholderImageLabel: "Détail mouvement jupe satinée",
    imageRatio: "portrait",
    details: "Coupe biais, zip côté invisible, ourlet midi asymétrique.",
    composition: "100% recycled polyester.",
    fit: "Taille régulière et tombé fluide.",
    ...shared,
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);
