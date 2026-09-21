"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import type { Product } from "@/types/product";

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Transform API product to search result format
function transformToSearchResult(apiProduct: any) {
  const minPrice = parseFloat(apiProduct.price_range.min_price);
  const maxPrice = parseFloat(apiProduct.price_range.max_price);

  const genderMap: Record<string, Product["gender"]> = {
    MEN: "men",
    WOMEN: "women",
    UNISEX: "unisex",
    KIDS: "boys",
    BABY: "boys",
  };

  const product: Product = {
    slug: apiProduct.slug,
    name: apiProduct.name,
    tagline: apiProduct.model?.name || "",
    model: apiProduct.model?.name || "Standard",
    articleNumber: apiProduct.id.substring(0, 8).toUpperCase(),
    price: minPrice,
    compareAtPrice: minPrice !== maxPrice ? maxPrice : undefined,
    gender: genderMap[apiProduct.gender] || "unisex",
    soleType: "leather",
    shaftHeight: "low",
    useCase: "indoor",
    colors: [
      {
        name: "Default",
        value: "default",
        image: apiProduct.primary_image.url,
      },
    ],
    sizes: [
      { name: "36", image: "" },
      { name: "37", image: "" },
      { name: "38", image: "" },
      { name: "39", image: "" },
      { name: "40", image: "" },
      { name: "41", image: "" },
      { name: "42", image: "" },
      { name: "43", image: "" },
      { name: "44", image: "" },
      { name: "45", image: "" },
    ],
    categories: [apiProduct.category?.slug || "uncategorized"],
    features: [],
    benefits: [],
    description: [],
    images: [apiProduct.primary_image.url],
    badge: apiProduct.is_featured ? "Bestseller" : undefined,
    featured: apiProduct.is_featured,
    addedAt: apiProduct.created_at,
    popularity: apiProduct.is_featured ? 100 : 0,
  };

  return {
    product,
    color: product.colors[0],
  };
}

function useSearchResults(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (query.trim().length < 2) return [];
      const apiProducts = await getProducts({ search: query, limit: 8 });
      return apiProducts.map(transformToSearchResult);
    },
    staleTime: 5 * 60 * 1000,
    enabled: query.trim().length >= 2,
  });
}

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const { data, isFetching } = useSearchResults(deferredQuery);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function goToProduct(url: string) {
    onOpenChange(false);
    router.push(url);
  }
  
  function searchAll() {
    onOpenChange(false);
    router.push(`/collections/all?search=${encodeURIComponent(deferredQuery)}`);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" className="h-auto max-w-none pb-8 sm:max-w-none">
        <SheetHeader>
          <SheetTitle className="sr-only">Search products</SheetTitle>
          <SheetDescription className="sr-only">
            Search the nyanopan catalogue by model or colour.
          </SheetDescription>
        </SheetHeader>
        <div className="container-page pt-6">
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && deferredQuery.trim().length >= 2) {
                  searchAll();
                }
              }}
              placeholder="Search slippers, models, colours"
              className="h-12 pl-9 text-base"
              aria-label="Search products"
            />
          </div>

          {deferredQuery.trim().length >= 2 && (
            <div className="mx-auto mt-4 max-w-2xl" role="listbox" aria-label="Search results">
              {isFetching && (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isFetching && data && data.length === 0 && (
                <p className="py-4 text-sm text-muted-foreground">
                  No products found for &quot;{deferredQuery}&quot;.
                </p>
              )}

              {!isFetching && data && data.length > 0 && (
                <ul className="divide-y">
                  {data.map(({ product, color }) => (
                    <li key={product.slug}>
                      <button
                        type="button"
                        onClick={() => goToProduct(`/products/${product.slug}`)}
                        className="flex w-full items-center gap-4 py-3 text-left transition-colors hover:bg-accent"
                      >
                        <Image
                          src={color.image}
                          alt=""
                          width={48}
                          height={48}
                          className="rounded-sm object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{product.name}</span>
                          <span className="block text-xs text-muted-foreground">
                            {product.tagline}
                          </span>
                        </span>
                        <span className="text-sm">{formatPrice(product.price)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {deferredQuery.trim().length >= 2 && !isFetching && (
                <div className="pt-2 text-sm">
                  <button
                    type="button"
                    onClick={searchAll}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    View all results for &quot;{deferredQuery}&quot;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
