import type { Metadata } from "next";

import { CollectionBrowser } from "@/components/collection/collection-browser";
import { PageHeader } from "@/components/shared/page-header";
import { getProductsPage, toStorefrontProduct } from "@/lib/api/products";

export const metadata: Metadata = {
  title: "Women's Collection",
  description: "Explore our collection of handcrafted slippers for women from the Kathmandu atelier.",
  alternates: { canonical: "/collections/women" },
};

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WomensCollectionPage() {
  // Fetch products filtered by gender=WOMEN
  const productsPage = await getProductsPage({ gender: "WOMEN", page_size: 12, page: 1 });
  const products = productsPage.results.map(toStorefrontProduct);

  return (
    <>
      <PageHeader
        title="Women's Collection"
        description="Handcrafted wool slippers designed for women. Made with care in our Kathmandu workshop."
        crumbs={[{ label: "Home", href: "/" }, { label: "Women's Collection" }]}
      />
      <CollectionBrowser collectionSlug="women" initialProducts={products} initialCount={productsPage.count} />
    </>
  );
}
