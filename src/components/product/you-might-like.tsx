"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, type Product as APIProduct } from "@/lib/api/products";
import { ProductCard } from "@/components/collection/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface YouMightLikeProps {
  categorySlug: string;
  excludeSlug: string;
}

// Transform API product to internal Product type
function transformProduct(apiProduct: APIProduct): Product {
  const minPrice = parseFloat(apiProduct.price_range.min_price);
  const maxPrice = parseFloat(apiProduct.price_range.max_price);

  const genderMap: Record<string, Product["gender"]> = {
    MEN: "men",
    WOMEN: "women",
    UNISEX: "unisex",
    KIDS: "boys",
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

export function YouMightLike({ categorySlug, excludeSlug }: YouMightLikeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const apiProducts = await getProducts({ category: categorySlug, limit: 12 });
        const filtered = apiProducts
          .filter(p => p.slug !== excludeSlug)
          .map(transformProduct);
        setProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categorySlug, excludeSlug]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < products.length - 4) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < products.length - 4;

  // Scroll to the correct position when index changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.scrollWidth / products.length;
      container.scrollTo({
        left: currentIndex * cardWidth,
        behavior: "smooth",
      });
    }
  }, [currentIndex, products.length]);

  if (loading) {
    return (
      <div className="container-page py-12 lg:py-16">
        <h2 className="text-2xl font-serif font-normal text-foreground mb-8">
          You might also like this
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  // If 4 or fewer products, show simple grid
  if (products.length <= 4) {
    return (
      <div className="container-page py-12 lg:py-16">
        <h2 className="text-2xl font-serif font-normal text-foreground mb-8">
          You might also like this
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    );
  }

  // Show carousel for more than 4 products
  return (
    <div className="container-page py-12 lg:py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif font-normal text-foreground">
          You might also like this
        </h2>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            disabled={!canGoPrev}
            className={cn(
              "h-9 w-9 rounded-full",
              !canGoPrev && "opacity-40 cursor-not-allowed"
            )}
            aria-label="Previous products"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={!canGoNext}
            className={cn(
              "h-9 w-9 rounded-full",
              !canGoNext && "opacity-40 cursor-not-allowed"
            )}
            aria-label="Next products"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative -mx-4 px-4 overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-hidden scroll-smooth"
          style={{
            scrollSnapType: "x mandatory",
          }}
        >
          {products.map((product) => (
            <div
              key={product.slug}
              className="flex-none w-[calc(50%-8px)] md:w-[calc(25%-12px)]"
              style={{ scrollSnapAlign: "start" }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
