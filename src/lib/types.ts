export type ImageRatio = "portrait" | "square" | "landscape";

export type Color = {
  id: string;
  name: string;
  hex: string;
};

export type ProductColor = Color & {
  imagePlaceholderLabel: string;
  imageUrl?: string;
};

export type Size = {
  id: string;
  label: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  placeholderImageLabel: string;
  imageUrl?: string;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string;
};

export type ProductAvailability = "in-stock" | "low-stock" | "out-of-stock";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceTnd: number;
  category: string;
  collection: string;
  colors: ProductColor[];
  defaultColor: string;
  sizes: string[];
  unavailableSizes: string[];
  badges: string[];
  isNew: boolean;
  isBestSeller: boolean;
  availability: ProductAvailability;
  placeholderImageLabel: string;
  imageRatio: ImageRatio;
  details: string;
  composition: string;
  fit: string;
  care: string;
  delivery: string;
  returns: string;
};

export type ProductBox = {
  id: string;
  slug: string;
  name: string;
  description: string;
  includedProductIds: string[];
  individualTotalPriceTnd: number;
  boxPriceTnd: number;
  savingsTnd: number;
  occasion: string;
  placeholderImageLabel: string;
  imageUrl?: string;
};
