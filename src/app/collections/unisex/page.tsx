import type { Metadata } from "next";

import { CollectionBrowser } from "@/components/collection/collection-browser";
import { PageHeader } from "@/components/shared/page-header";
import { getProductsPage, toStorefrontProduct } from "@/lib/api/products";

export const metadata: Metadata = {
  title: "Unisex Collection",
  description: "Explore our collection of handcrafted unisex slippers from the Kathmandu atelier.",
  alternates: { canonical: "/collections/unisex" },
};

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UnisexCollectionPage() {
  // Fetch products filtered by gender=UNISEX
  const productsPage = await getProductsPage({ gender: "UNISEX", page_size: 12, page: 1 });
  const products = productsPage.results.map(toStorefrontProduct);

  return (
    <>
      <PageHeader
        title="Unisex Collection"
        description="Handcrafted wool slippers designed for everyone. Made with care in our Kathmandu workshop."
        crumbs={[{ label: "Home", href: "/" }, { label: "Unisex Collection" }]}
      />
      <CollectionBrowser collectionSlug="unisex" initialProducts={products} initialCount={productsPage.count} />
    </>
  );
}
