"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/collection/product-card";
import { useWishlistSlugs } from "@/hooks/use-wishlist";
import { useQuery } from "@tanstack/react-query";
import { getProducts, toStorefrontProduct } from "@/lib/api/products";

export function WishlistContent() {
  const wishlistSlugs = useWishlistSlugs();

  // Fetch all products and filter by wishlist slugs
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const apiProducts = await getProducts({ limit: 100 });
      return apiProducts.map(toStorefrontProduct);
    },
  });

  const wishlistProducts = allProducts?.filter((product) =>
    wishlistSlugs.includes(product.slug)
  );

  if (isLoading) {
    return (
      <div className="container-page py-10 lg:py-14">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6 md:gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!wishlistProducts || wishlistProducts.length === 0) {
    return (
      <div className="container-page py-16 lg:py-24">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <h2 className="mb-3 text-2xl font-semibold">Your wishlist is empty</h2>
          <p className="mb-6 text-muted-foreground">
            Save your favorite products to come back to them later.
          </p>
          <Button asChild>
            <Link href="/collections/all">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6 md:gap-y-10">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
