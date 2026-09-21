import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionBrowser } from "@/components/collection/collection-browser";
import { PageHeader } from "@/components/shared/page-header";
import { CollectionSchema } from "@/components/seo/collection-schema";
import { getCategories } from "@/lib/api/categories";
import { getProducts, type Product as APIProduct } from "@/lib/api/products";
import { generateCollectionKeywords } from "@/lib/seo/keywords";
import type { Product } from "@/types/product";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
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

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  
  if (!category) return {};
  
  // Get products count
  const apiProducts = await getProducts({ category: slug, limit: 100 });
  const productCount = apiProducts.length;
  
  // Enhanced description
  const description = category.description || 
    `Discover our ${category.name} collection. ${productCount} handcrafted products made from 100% natural wool by fair trade artisans in Kathmandu, Nepal.`;
  
  // Get first product image for OG image
  const firstProductImage = apiProducts[0]?.primary_image?.url;
  
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
  const apiProducts = await getProducts({ category: slug, limit: 100 });
  const initialProducts = apiProducts.map(transformProduct);

  return (
    <>
      {/* Structured Data */}
      <CollectionSchema
        collection={{
          name: category.name,
          description: category.description || `Explore our ${category.name} collection`,
          slug: category.slug,
          numberOfItems: apiProducts.length,
        }}
      />
      
      <PageHeader
        title={category.name}
        description={category.description || `Explore our ${category.name} collection`}
        crumbs={[{ label: "Home", href: "/" }, { label: category.name }]}
      />
      <CollectionBrowser collectionSlug={slug} initialProducts={initialProducts} />
    </>
  );
}
