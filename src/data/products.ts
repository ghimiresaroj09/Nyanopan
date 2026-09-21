import type { Product } from "@/types/product";

/**
 * Static product data removed - all products now fetched from API
 * This file is kept for backward compatibility with existing imports
 */

export const products: Product[] = [];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(slug: string): Product[] {
  if (slug === "all-slippers") return products;
  return products.filter((p) => p.categories.includes(slug));
}
