"use client";

import { useEffect } from "react";

import { ProductCard } from "@/components/collection/product-card";
import { recentlyViewed, useRecentlyViewedSlugs } from "@/hooks/use-recently-viewed";
import type { Product } from "@/types/product";

interface RecentlyViewedProps {
  currentSlug: string;
}

/**
 * Local, client-side history of products the visitor opened. Nothing
 * is sent to any server.
 * TODO: Fetch products from API instead of static data
 */
export function RecentlyViewed({ currentSlug }: RecentlyViewedProps) {
  const slugs = useRecentlyViewedSlugs();

  useEffect(() => {
    recentlyViewed.record(currentSlug);
  }, [currentSlug]);

  // Products need to be fetched from API
  const items: Product[] = [];

  if (items.length === 0) return null;

  return (
    <section className="container-page py-14" aria-label="Recently viewed products">
      <h2 className="font-serif text-2xl">Recently viewed</h2>
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
