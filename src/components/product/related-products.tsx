"use client";

import { useRelatedProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/collection/product-card";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedProductsProps {
  model: string;
  excludeSlug: string;
}

export function RelatedProducts({ model, excludeSlug }: RelatedProductsProps) {
  const { data, isFetching } = useRelatedProducts(model, excludeSlug);

  if (isFetching && !data) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
      {data.slice(0, 4).map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
