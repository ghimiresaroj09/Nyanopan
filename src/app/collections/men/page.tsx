import type { Metadata } from "next";

import { CollectionBrowser } from "@/components/collection/collection-browser";
import { PageHeader } from "@/components/shared/page-header";
import { getProductsPage, toStorefrontProduct } from "@/lib/api/products";

export const metadata: Metadata = {
  title: "Men's Collection",
  description: "Explore our collection of handcrafted slippers for men from the Kathmandu atelier.",
  alternates: { canonical: "/collections/men" },
};

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MensCollectionPage() {
  // Fetch products filtered by gender=MEN
  const productsPage = await getProductsPage({ gender: "MEN", page_size: 12, page: 1 });
  const products = productsPage.results.map(toStorefrontProduct);

  return (
    <>
      <PageHeader
        title="Men's Collection"
        description="Handcrafted wool slippers designed for men. Made with care in our Kathmandu workshop."
        crumbs={[{ label: "Home", href: "/" }, { label: "Men's Collection" }]}
      />
      <CollectionBrowser collectionSlug="men" initialProducts={products} initialCount={productsPage.count} />
    </>
  );
}
