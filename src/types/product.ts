export type SoleType = "leather" | "rubber";
export type Gender = "women" | "men" | "unisex" | "girls" | "boys";
export type ShaftHeight = "low" | "mid" | "high";
export type UseCase = "indoor" | "indoor-outdoor";

export interface ProductColor {
  /** Display name, e.g. "Marbled Light Grey". */
  name: string;
  /** Normalised filter value, e.g. "grey". */
  value: string;
  /** Image shown for this colour variant. */
  image: string;
}

export interface ProductSize {
  /** Display name, e.g. "M", "L", "36", "37". */
  name: string;
  /** Image shown for this size variant (optional). */
  image: string;
}

export interface ProductFeature {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  tagline: string;
  model: string;
  articleNumber: string;
  price: number;
  compareAtPrice?: number;
  gender: Gender;
  soleType: SoleType;
  shaftHeight: ShaftHeight;
  useCase: UseCase;
  colors: ProductColor[];
  sizes: ProductSize[];
  /** Collection slugs this product belongs to. */
  categories: string[];
  features: ProductFeature[];
  benefits: string[];
  description: string[];
  images: string[];
  badge?: "New" | "Special edition" | "Bestseller";
  featured?: boolean;
  /** ISO date, used for the "newest" sort order. */
  addedAt: string;
  /** Used for the "best selling" sort order. */
  popularity: number;
}

export interface ProductFilters {
  colors: string[];
  soles: SoleType[];
  models: string[];
  genders: Gender[];
  sizes: string[];
}

export type SortOption =
  | "featured"
  | "a-z"
  | "z-a"
  | "price-low-high"
  | "price-high-low"
  | "newest"
  | "oldest";

export const EMPTY_FILTERS: ProductFilters = {
  colors: [],
  soles: [],
  models: [],
  genders: [],
  sizes: [],
};
