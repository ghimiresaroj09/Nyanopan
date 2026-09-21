import type { Metadata } from "next";

import { CollectionBrowser } from "@/components/collection/collection-browser";
import { PageHeader } from "@/components/shared/page-header";
import { getProducts, type Product as APIProduct } from "@/lib/api/products";
import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Men's Collection",
  description: "Explore our collection of handcrafted slippers for men from the Kathmandu atelier.",
  alternates: { canonical: "/collections/men" },
};

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    gender: genderMap[apiProduct.gender] || "men",
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

export default async function MensCollectionPage() {
  // Fetch products filtered by gender=MEN
  const apiProducts = await getProducts({ gender: "MEN", limit: 100 });
  const products = apiProducts.map(transformProduct);

  return (
    <>
      <PageHeader
        title="Men's Collection"
        description="Handcrafted wool slippers designed for men. Made with care in our Kathmandu workshop."
        crumbs={[{ label: "Home", href: "/" }, { label: "Men's Collection" }]}
      />
      <CollectionBrowser collectionSlug="men" initialProducts={products} />
    </>
  );
}
