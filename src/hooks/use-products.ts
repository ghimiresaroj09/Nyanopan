"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchProduct,
  fetchProducts,
  fetchRelatedProducts,
  fetchSearchResults,
} from "@/lib/api";
import type { Product } from "@/types/product";

export function useProducts(initialData?: Product[], queryKey?: string[]) {
  return useQuery({
    queryKey: queryKey || ["products"],
    queryFn: fetchProducts,
    initialData,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    enabled: Boolean(slug),
  });
}

export function useRelatedProducts(model: string, excludeSlug: string) {
  return useQuery({
    queryKey: ["related", model, excludeSlug],
    queryFn: () => fetchRelatedProducts(model, excludeSlug),
    enabled: Boolean(model),
  });
}

export function useSearchResults(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearchResults(query),
    enabled: query.trim().length >= 2,
  });
}
