import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductCard } from "@/components/collection/product-card";
import { getFeaturedProducts, type Product as APIProduct } from "@/lib/api/products";
import type { Product } from "@/types/product";

// Transform API product to internal Product type
function transformProduct(apiProduct: APIProduct): Product {
  const minPrice = parseFloat(apiProduct.price_range.min_price);
  const maxPrice = parseFloat(apiProduct.price_range.max_price);

  return {
    slug: apiProduct.slug,
    name: apiProduct.name,
    tagline: apiProduct.model.name,
    model: apiProduct.model.name,
    articleNumber: apiProduct.id.substring(0, 8),
    price: minPrice,
    compareAtPrice: minPrice !== maxPrice ? maxPrice : undefined,
    gender: apiProduct.gender.toLowerCase() as Product["gender"],
    soleType: "leather", // Default, could be enhanced with API data
    shaftHeight: "low", // Default, could be enhanced with API data
    useCase: "indoor", // Default, could be enhanced with API data
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
    ], // Default sizes
    categories: [apiProduct.category.slug],
    features: [],
    benefits: [],
    description: [],
    images: [apiProduct.primary_image.url],
    badge: apiProduct.is_featured ? "Bestseller" : undefined,
    featured: apiProduct.is_featured,
    addedAt: apiProduct.created_at,
    popularity: 0,
  };
}

interface FeaturedProductsProps {
  products?: APIProduct[];
}

export async function FeaturedProducts({ products: providedProducts }: FeaturedProductsProps = {}) {
  const apiProducts = providedProducts || await getFeaturedProducts(4);
  const featured = apiProducts.map(transformProduct);

  if (featured.length === 0) return null;

  const totalCount = apiProducts.length > 0 ? `${apiProducts.length}+` : "22";

  return (
    <section className="container-page pb-16 md:pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <span className="editorial-eyebrow">Signature Works</span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl tracking-tight text-foreground">Featured slippers</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Iconic silhouettes from the Kathmandu atelier, hand-felted from untreated Himalayan wool.
          </p>
        </div>
        <Link
          href="/collections/all"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:text-terracotta transition-colors"
        >
          View all {totalCount} models
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
