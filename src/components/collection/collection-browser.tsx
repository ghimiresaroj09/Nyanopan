"use client";

import { Suspense, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterSidebar } from "@/components/collection/filter-sidebar";
import { ProductGrid } from "@/components/collection/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/use-products";
import { filterProducts, getCollectionFacets } from "@/lib/api";
import { parseSearchParams } from "@/lib/schemas/filters";
import type { Product, ProductFilters, SortOption } from "@/types/product";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "best-selling": "Best selling",
  "a-z": "Alphabetically, A-Z",
  "z-a": "Alphabetically, Z-A",
  "price-low-high": "Price, low to high",
  "price-high-low": "Price, high to low",
  newest: "Date, new to old",
};

interface CollectionBrowserProps {
  collectionSlug: string;
  initialProducts: Product[];
}

function CollectionBrowserInner({ collectionSlug, initialProducts }: CollectionBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: products, isFetching } = useProducts(initialProducts);

  const { color, sole, model, gender, size, sort } = parseSearchParams(
    Object.fromEntries(searchParams.entries())
  );

  const filters: ProductFilters = useMemo(
    () => ({
      colors: color,
      soles: sole,
      models: model,
      genders: gender,
      sizes: size,
    }),
    [color, sole, model, gender, size]
  );

  const facets = useMemo(() => getCollectionFacets(collectionSlug), [collectionSlug]);

  const visibleProducts = useMemo(
    () => filterProducts(products ?? initialProducts, filters, sort),
    [products, initialProducts, filters, sort]
  );

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
    router.replace(query ? `?${query}` : pathname, { scroll: false });
  }

  function toggle(group: keyof ProductFilters, value: string) {
    const key = group.slice(0, -1) as "color" | "sole" | "model" | "gender" | "size";
    const current = (filters[group] as (string | number)[]).map(String);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParams({ [key]: next.join(",") || undefined });
  }

  function clearFilters() {
    updateParams({ color: undefined, sole: undefined, model: undefined, gender: undefined, size: undefined });
  }

  const hasActiveFilters = Object.values(filters).some((v) => v.length > 0);

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[240px_1fr] lg:py-14">
      <aside className="hidden lg:block">
        <FilterSidebar facets={facets} filters={filters} onToggle={toggle} onClear={clearFilters} />
      </aside>

      <div>
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
                  <FilterSidebar
                    facets={facets}
                    filters={filters}
                    onToggle={toggle}
                    onClear={clearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Show {visibleProducts.length} {visibleProducts.length === 1 ? "result" : "results"}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-3 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Clear all
                </button>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="hidden text-sm text-muted-foreground sm:block">
              Sort by
            </label>
            <Select
              value={sort}
              onValueChange={(value) => updateParams({ sort: value === "featured" ? undefined : value })}
            >
              <SelectTrigger id="sort-select" className="h-9 w-[170px]" aria-label="Sort by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
          {isFetching && products === undefined ? (
            <ProductGridSkeleton />
          ) : visibleProducts.length === 0 ? (
            <div className="rounded-md border border-dashed px-6 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                No slippers match these filters.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
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
