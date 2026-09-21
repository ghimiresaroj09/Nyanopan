"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/collection/product-card";
import { useWishlistSlugs } from "@/hooks/use-wishlist";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api/products";
import type { Product as APIProduct } from "@/lib/api/products";
import type { Product } from "@/types/product";

// Transform API product to internal Product type
function transformProduct(apiProduct: APIProduct): Product {
  const minPrice = parseFloat(apiProduct.price_range.min_price);
  const maxPrice = parseFloat(apiProduct.price_range.max_price);

  const genderMap: Record<string, Product["gender"]> = {
    MEN: "men",
    WOMEN: "women",
    UNISEX: "unisex",
    KIDS: "boys",
    BABY: "boys",
  };

  return {
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
}

export function WishlistContent() {
  const wishlistSlugs = useWishlistSlugs();

  // Fetch all products and filter by wishlist slugs
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const apiProducts = await getProducts({ limit: 100 });
      return apiProducts.map(transformProduct);
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
