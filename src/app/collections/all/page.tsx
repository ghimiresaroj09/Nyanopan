import type { Metadata } from "next";

import { CollectionBrowser } from "@/components/collection/collection-browser";
import { PageHeader } from "@/components/shared/page-header";
import { getProductsPage, toStorefrontProduct } from "@/lib/api/products";
import { mapSortToAPI } from "@/lib/api/sort-mapper";
import type { SortOption } from "@/types/product";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our complete collection of handcrafted slippers from the Kathmandu atelier.",
  alternates: { canonical: "/collections/all" },
};

// Force dynamic rendering to handle search params
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const productsPage = await getProductsPage({
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
    page_size: 12,
    page: 1,
  });
  
  console.log(`🔍 All Products Page - Fetched ${productsPage.results.length} products`);
  
  // Transform API products to internal format
  const products = productsPage.results.map(toStorefrontProduct);

  return (
    <>
      <PageHeader
        title="All Products"
        description="Explore our complete collection of hand-felted slippers, crafted with care in Kathmandu."
        crumbs={[{ label: "Home", href: "/" }, { label: "All Products" }]}
      />
      <CollectionBrowser collectionSlug="all" initialProducts={products} initialCount={productsPage.count} />
    </>
  );
}
