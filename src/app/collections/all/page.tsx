import type { Metadata } from "next";

import { CollectionBrowser } from "@/components/collection/collection-browser";
import { PageHeader } from "@/components/shared/page-header";
import { getProducts, type Product as APIProduct } from "@/lib/api/products";
import { mapSortToAPI, mapSoleTypeToAPI } from "@/lib/api/sort-mapper";
import type { Product, SortOption } from "@/types/product";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our complete collection of handcrafted slippers from the Kathmandu atelier.",
  alternates: { canonical: "/collections/all" },
};

// Force dynamic rendering to handle search params
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Transform API product to internal Product type
function transformProduct(apiProduct: APIProduct): Product {
  const minPrice = parseFloat(apiProduct.price_range.min_price);
  const maxPrice = parseFloat(apiProduct.price_range.max_price);

  // Map API gender to internal gender format
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
    soleType: "leather", // Default, can be enhanced with API data
    shaftHeight: "low", // Default, can be enhanced with API data
    useCase: "indoor", // Default, can be enhanced with API data
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

interface AllProductsPageProps {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    sole_type?: string;
    gender?: string;
    usage_location?: string;
    model?: string;
    min_price?: string;
    max_price?: string;
    [key: string]: string | undefined; // Allow dynamic attribute_* params
  }>;
}

export default async function AllProductsPage({ searchParams }: AllProductsPageProps) {
  const params = await searchParams;
  
  // Parse query parameters
  const search = params.search;
  const sort = params.sort as SortOption | undefined;
  const soleType = params.sole_type;
  const gender = params.gender;
  const usageLocation = params.usage_location as "INSIDE" | "OUTSIDE" | "BOTH" | undefined;
  const model = params.model;
  const minPrice = params.min_price ? parseFloat(params.min_price) : undefined;
  const maxPrice = params.max_price ? parseFloat(params.max_price) : undefined;
  
  // Extract attribute filters (attribute_<id>=<value_id>)
  const attributeFilters: Record<string, string> = {};
  Object.keys(params).forEach(key => {
    if (key.startsWith('attribute_') && params[key]) {
      attributeFilters[key] = params[key] as string;
    }
  });
  
  // Map to API parameters
  const apiSortOption = sort ? mapSortToAPI(sort) : undefined;
  const apiSoleType = soleType as "LEATHER" | "RUBBER" | undefined;
  const isFeatured = sort === "featured" ? true : undefined;
  
  console.log("🔍 All Products Page - Search params:", { search, sort, gender, soleType, usageLocation, model, minPrice, maxPrice, attributes: attributeFilters });
  console.log("🔍 All Products Page - API params:", { search, ordering: apiSortOption, is_featured: isFeatured, gender, sole_type: apiSoleType, usage_location: usageLocation, model, min_price: minPrice, max_price: maxPrice, ...attributeFilters });
  
  // Fetch products from API with filters (including attribute filters)
  const apiProducts = await getProducts({
    search,
    ordering: apiSortOption,
    is_featured: isFeatured,
    gender,
    sole_type: apiSoleType,
    usage_location: usageLocation,
    model,
    min_price: minPrice,
    max_price: maxPrice,
    ...attributeFilters, // Spread attribute filters
    limit: 100,
  });
  
  console.log(`🔍 All Products Page - Fetched ${apiProducts.length} products`);
  
  // Transform API products to internal format
  const products = apiProducts.map(transformProduct);

  return (
    <>
      <PageHeader
        title="All Products"
        description="Explore our complete collection of hand-felted slippers, crafted with care in Kathmandu."
        crumbs={[{ label: "Home", href: "/" }, { label: "All Products" }]}
      />
      <CollectionBrowser collectionSlug="all" initialProducts={products} />
    </>
  );
}
