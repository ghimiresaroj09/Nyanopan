import type { CollectionFacets } from "@/types/collection";
import type { Gender, Product, ProductFilters, SoleType, SortOption } from "@/types/product";

/**
 * Data access layer - Static product data removed.
 * All product data now comes from the API.
 * These functions are kept for backward compatibility with existing code.
 */

const NETWORK_LATENCY_MS = 250;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getProducts(): Product[] {
  return [];
}

export function getProduct(_slug: string): Product | undefined {
  return undefined;
}

export function getCollections() {
  return [];
}

export function getCollectionFacets(_collectionSlug: string): CollectionFacets {
  // Return empty facets - data now comes from API
  return { 
    colors: [], 
    soles: [], 
    models: [], 
    genders: [], 
    sizes: [] 
  };
}

export function filterProducts(
  items: Product[],
  filters: ProductFilters,
  sort: SortOption
): Product[] {
  let result = items;

  if (filters.colors.length > 0) {
    result = result.filter((p) => p.colors.some((c) => filters.colors.includes(c.value)));
  }
  if (filters.soles.length > 0) {
    result = result.filter((p) => filters.soles.includes(p.soleType));
  }
  if (filters.models.length > 0) {
    result = result.filter((p) => filters.models.includes(p.model));
  }
  if (filters.genders.length > 0) {
    result = result.filter((p) => filters.genders.includes(p.gender));
  }
  if (filters.sizes.length > 0) {
    result = result.filter((p) => p.sizes.some((s) => filters.sizes.includes(s.name)));
  }

  switch (sort) {
    case "a-z":
      return [...result].sort((a, b) => a.name.localeCompare(b.name));
    case "z-a":
      return [...result].sort((a, b) => b.name.localeCompare(a.name));
    case "price-low-high":
      return [...result].sort((a, b) => a.price - b.price);
    case "price-high-low":
      return [...result].sort((a, b) => b.price - a.price);
    case "newest":
      return [...result].sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );
    case "oldest":
      return [...result].sort(
        (a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
      );
    case "featured":
    default:
      return [...result].sort(
        (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || b.popularity - a.popularity
      );
  }
}

/* Async variants for React Query. */

export async function fetchProducts(): Promise<Product[]> {
  await delay(NETWORK_LATENCY_MS);
  return [];
}

export async function fetchProduct(_slug: string): Promise<Product | undefined> {
  await delay(NETWORK_LATENCY_MS);
  return undefined;
}

export async function fetchRelatedProducts(
  _model: string,
  _excludeSlug: string
): Promise<Product[]> {
  await delay(NETWORK_LATENCY_MS);
  return [];
}

export interface SearchResult {
  product: Product;
  color: { name: string; image: string };
}

export async function fetchSearchResults(_query: string): Promise<SearchResult[]> {
  await delay(NETWORK_LATENCY_MS);
  // Search now handled by API
  return [];
}

export type { Gender, SoleType };
