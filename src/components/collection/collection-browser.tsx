"use client";

import { Suspense, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiFilterSidebar } from "@/components/collection/api-filter-sidebar";
import { ProductGrid } from "@/components/collection/product-grid";
import { parseSearchParams } from "@/lib/schemas/filters";
import type { Product, SortOption } from "@/types/product";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "a-z": "A to Z",
  "z-a": "Z to A",
  "price-low-high": "Price, low to high",
  "price-high-low": "Price, high to low",
  newest: "Recently added",
  oldest: "Previously added",
};

const DEFAULT_SORT_LABEL = "None";

interface CollectionBrowserProps {
  collectionSlug: string;
  initialProducts: Product[];
}

function CollectionBrowserInner({ collectionSlug, initialProducts }: CollectionBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const sortQuery = searchParams.get("sort") || "";
  const genderFilter = searchParams.get("gender") || "";
  const soleFilter = searchParams.get("sole_type") || "";
  const usageFilter = searchParams.get("usage_location") || "";
  const modelFilter = searchParams.get("model") || "";
  
  const [searchInput, setSearchInput] = useState(searchQuery);
  
  // Sync search input with URL param changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);
  
  // Auto-search as user types (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== searchQuery) {
        if (searchInput.trim().length > 0) {
          const params = new URLSearchParams(searchParams.toString());
          params.set('search', searchInput.trim());
          router.push(`${pathname}?${params.toString()}`);
        } else if (searchQuery) {
          // Clear search if input is empty
          const params = new URLSearchParams(searchParams.toString());
          params.delete('search');
          router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
        }
      }
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [searchInput, searchQuery, pathname, searchParams, router]);

  const { sort } = parseSearchParams(
    Object.fromEntries(searchParams.entries())
  );

  const visibleProducts = initialProducts;
  
  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    const query = params.toString();
    
    // Use router.push to trigger server-side navigation
    const newUrl = query ? `${pathname}?${query}` : pathname;
    router.push(newUrl);
  }
  
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    // Search now happens automatically via useEffect, but keep this for Enter key
    if (searchInput.trim().length > 0) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('search', searchInput.trim());
      router.push(`${pathname}?${params.toString()}`);
    } else {
      clearSearch();
    }
  }
  
  function clearSearch() {
    setSearchInput("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  const hasSearch = searchQuery.length > 0;

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[240px_1fr] lg:py-14">
      <aside className="hidden lg:block">
        {/* API-based filters only */}
        <ApiFilterSidebar />
      </aside>

      <div>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle>Filter</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  {/* API-based filters only */}
                  <ApiFilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Show {visibleProducts.length} {visibleProducts.length === 1 ? "result" : "results"}
              {hasSearch && (
                <span className="ml-1">
                  for &quot;{searchQuery}&quot;
                </span>
              )}
              {hasSearch && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="ml-3 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Clear search
                </button>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="hidden text-sm text-muted-foreground sm:block">
              Sort by
            </label>
            <Select
              value={sort || "none"}
              onValueChange={(value) => {
                if (value === "none" || value === "") {
                  updateParams({ sort: undefined });
                } else {
                  updateParams({ sort: value });
                }
              }}
            >
              <SelectTrigger id="sort-select" className="h-9 w-[170px]" aria-label="Sort by">
                <SelectValue placeholder={DEFAULT_SORT_LABEL} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{DEFAULT_SORT_LABEL}</SelectItem>
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <SelectItem key={option} value={option}>
                    {SORT_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8">
          {visibleProducts.length === 0 ? (
            <div className="rounded-md border border-dashed px-6 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                No products found. Try adjusting your filters or search.
              </p>
            </div>
          ) : (
            <ProductGrid products={visibleProducts} />
          )}
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square w-full rounded-md" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

export function CollectionBrowser(props: CollectionBrowserProps) {
  return (
    <Suspense fallback={<div className="container-page py-10"><ProductGridSkeleton /></div>}>
      <CollectionBrowserInner {...props} />
    </Suspense>
  );
}
