"use client";

import { useEffect } from "react";

import { ProductCard } from "@/components/collection/product-card";
import { getProductBySlug } from "@/data/products";
import { recentlyViewed, useRecentlyViewedSlugs } from "@/hooks/use-recently-viewed";
import type { Product } from "@/types/product";

interface RecentlyViewedProps {
  currentSlug: string;
}

/**
 * Local, client-side history of products the visitor opened. Nothing
 * is sent to any server.
 */
export function RecentlyViewed({ currentSlug }: RecentlyViewedProps) {
  const slugs = useRecentlyViewedSlugs();

  useEffect(() => {
    recentlyViewed.record(currentSlug);
  }, [currentSlug]);

  const items = slugs
    .filter((slug) => slug !== currentSlug)
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is Product => Boolean(product))
    .slice(0, 4);

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
