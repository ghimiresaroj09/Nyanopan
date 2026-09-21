import type { SortOption as APISortOption } from "@/lib/api/products";
import type { SortOption as InternalSortOption } from "@/types/product";

/**
 * Maps internal sort options to API sort parameters
 * Backend uses Django REST Framework style: field or -field for descending
 */
export function mapSortToAPI(sort: InternalSortOption): APISortOption | undefined {
  const mapping: Record<InternalSortOption, APISortOption | undefined> = {
    "featured": undefined,           // Uses is_featured=true filter instead
    "a-z": "name",                   // name ascending
    "z-a": "-name",                  // name descending (minus prefix)
    "price-low-high": "price",       // price ascending
    "price-high-low": "-price",      // price descending (minus prefix)
    "newest": "-created_at",         // newest first (minus = descending date)
    "oldest": "created_at",          // oldest first (ascending date)
  };
  
  return mapping[sort];
}

/**
 * Maps internal sole type to API sole type
 */
export function mapSoleTypeToAPI(soleType: string): "LEATHER" | "RUBBER" | undefined {
  const mapping: Record<string, "LEATHER" | "RUBBER" | undefined> = {
    "leather": "LEATHER",
    "rubber": "RUBBER",
  };
  
  return mapping[soleType.toLowerCase()];
}

/**
 * Maps internal gender to API gender
 */
export function mapGenderToAPI(gender: string): string {
  const mapping: Record<string, string> = {
    "men": "MEN",
    "women": "WOMEN",
    "unisex": "UNISEX",
    "boys": "KIDS",
    "girls": "KIDS",
  };
  
  return mapping[gender.toLowerCase()] || gender.toUpperCase();
}
