"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchResults } from "@/hooks/use-products";
import { formatPrice } from "@/lib/format";

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
                  <Link
                    href={`/collections/all-slippers`}
                    onClick={() => onOpenChange(false)}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    View the full collection
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
