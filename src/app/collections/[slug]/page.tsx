import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionBrowser } from "@/components/collection/collection-browser";
import { PageHeader } from "@/components/shared/page-header";
import { CollectionSchema } from "@/components/seo/collection-schema";
import { getCategories } from "@/lib/api/categories";
import { getProductsPage, toStorefrontProduct } from "@/lib/api/products";
import { generateCollectionKeywords } from "@/lib/seo/keywords";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  
  if (!category) return {};
  
  // Get products count
  const productsPage = await getProductsPage({ category: slug, page_size: 12, page: 1 });
  const productCount = productsPage.count;
  
  // Enhanced description
  const description = category.description;
  
  // Get first product image for OG image
  const firstProductImage = productsPage.results[0]?.primary_image?.url;
  
  // Generate dynamic keywords
  const keywords = generateCollectionKeywords({
    categoryName: category.name,
    categorySlug: category.slug,
  });
  
  return {
    title: category.name,
    description: description.substring(0, 160),
    keywords,
    alternates: { canonical: `/collections/${category.slug}` },
    openGraph: {
      title: `${category.name} Collection`,
      description: description.substring(0, 160),
      type: "website",
      url: `/collections/${category.slug}`,
      ...(firstProductImage && {
        images: [
          {
            url: firstProductImage,
            width: 1200,
            height: 630,
            alt: `${category.name} Collection`,
          },
        ],
      }),
      siteName: "Nyanopan",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} Collection`,
      description: description.substring(0, 160),
      ...(firstProductImage && { images: [firstProductImage] }),
    },
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  
  // Fetch categories and products
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  
  if (!category) notFound();

  // Fetch products for this category
  const productsPage = await getProductsPage({ category: slug, page_size: 12, page: 1 });
  const initialProducts = productsPage.results.map(toStorefrontProduct);

  return (
    <>
      {/* Structured Data */}
      <CollectionSchema
        collection={{
          name: category.name,
          description: category.description,
          slug: category.slug,
          numberOfItems: productsPage.count,
        }}
      />
      
      <PageHeader
        title={category.name}
        description={category.description}
        crumbs={[{ label: "Home", href: "/" }, { label: category.name }]}
      />
      <CollectionBrowser collectionSlug={slug} initialProducts={initialProducts} initialCount={productsPage.count} />
    </>
  );
}
