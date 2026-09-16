"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchProduct,
  fetchProducts,
  fetchRelatedProducts,
  fetchSearchResults,
} from "@/lib/api";
import type { Product } from "@/types/product";

const STALE_TIME = 5 * 60 * 1000;

export function useProducts(initialData?: Product[]) {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: STALE_TIME,
    initialData,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    staleTime: STALE_TIME,
    enabled: Boolean(slug),
  });
}

export function useRelatedProducts(model: string, excludeSlug: string) {
  return useQuery({
    queryKey: ["related", model, excludeSlug],
    queryFn: () => fetchRelatedProducts(model, excludeSlug),
    staleTime: STALE_TIME,
    enabled: Boolean(model),
  });
}

export function useSearchResults(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearchResults(query),
    staleTime: STALE_TIME,
    enabled: query.trim().length >= 2,
  });
}
