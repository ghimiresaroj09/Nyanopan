import type { CollectionFacets } from "@/types/collection";
import type { Gender, Product, ProductFilters, SoleType, SortOption } from "@/types/product";
import { getProductsByCollection, products } from "@/data/products";
import { collections } from "@/data/collections";

/**
 * Data access layer. In production these functions would call the
 * commerce backend. Here they read the static catalog, with an
 * artificial latency on the async variants so React Query's loading
 * states behave like they would against a real API.
 */

const NETWORK_LATENCY_MS = 250;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getProducts(): Product[] {
  return products;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCollections() {
  return collections;
}

export function getCollectionFacets(collectionSlug: string): CollectionFacets {
  const items = getProductsByCollection(collectionSlug);
  const colors = Array.from(new Set(items.flatMap((p) => p.colors.map((c) => c.value)))).sort();
  const soles = Array.from(new Set(items.map((p) => p.soleType))).sort();
  const models = Array.from(new Set(items.map((p) => p.model))).sort();
  const genders = Array.from(new Set(items.map((p) => p.gender))).sort();
  const sizes = Array.from(new Set(items.flatMap((p) => p.sizes))).sort((a, b) => a - b);
  return { colors, soles, models, genders, sizes };
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
    result = result.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
  }

  switch (sort) {
    case "best-selling":
      return [...result].sort((a, b) => b.popularity - a.popularity);
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
  return products;
}

export async function fetchProduct(slug: string): Promise<Product | undefined> {
  await delay(NETWORK_LATENCY_MS);
  return products.find((p) => p.slug === slug);
}

export async function fetchRelatedProducts(
  model: string,
  excludeSlug: string
): Promise<Product[]> {
  await delay(NETWORK_LATENCY_MS);
  return products.filter((p) => p.model === model && p.slug !== excludeSlug);
}

export interface SearchResult {
  product: Product;
  color: { name: string; image: string };
}

export async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  await delay(NETWORK_LATENCY_MS);
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const matches: SearchResult[] = [];
  for (const product of products) {
    const haystack = `${product.name} ${product.model} ${product.tagline}`.toLowerCase();
    if (haystack.includes(q)) {
      matches.push({ product, color: product.colors[0] });
    }
  }
  return matches.slice(0, 8);
}

export type { Gender, SoleType };
