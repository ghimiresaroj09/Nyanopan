import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductDetail } from "@/components/product/product-detail";
import { RelatedProducts } from "@/components/product/related-products";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { YouMightLike } from "@/components/product/you-might-like";
import { ProductSchema } from "@/components/seo/product-schema";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";
import { getProduct, type ProductDetail as APIProduct } from "@/lib/api/products";
import { generateProductKeywords } from "@/lib/seo/keywords";
import type { Product } from "@/types/product";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const productData = await getProduct(slug);
  
  if (!productData) {
    return {
      title: "Product Not Found",
    };
  }
  
  // Get price range
  const prices = productData.product_varient_values.map((v) => v.price);
  const minPrice = Math.min(...prices);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const maxPrice = Math.max(...prices);
  
  // Generate rich description
  const description = productData.description || 
    `Handcrafted ${productData.model.name} from Kathmandu. ${productData.category.name}. Made from 100% natural wool by fair trade artisans in Nepal.`;
  
  // Get primary image
  const primaryImage = productData.feature_image?.url;
  
  // Generate dynamic keywords based on product attributes
  const keywords = generateProductKeywords({
    categorySlug: productData.category.slug,
    productName: productData.name,
    modelName: productData.model.name,
    gender: productData.gender.toLowerCase(),
    isHandmade: true,
  });
  
  return {
    title: productData.name,
    description: description.substring(0, 160), // SEO best practice: 150-160 chars
    keywords,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: productData.name,
      description: description.substring(0, 160),
      type: "website",
      url: `/products/${slug}`,
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: productData.name,
        },
      ],
      siteName: "Nyanopan",
    },
    twitter: {
      card: "summary_large_image",
      title: productData.name,
      description: description.substring(0, 160),
      images: [primaryImage],
    },
    other: {
      "product:price:amount": minPrice.toString(),
      "product:price:currency": "NPR",
      "product:availability": "in stock",
      "product:condition": "new",
      "product:brand": "Nyanopan",
    },
  };
}

/* Product pages are dynamic - fetched from API */
export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  // Fetch product from API
  const productData = await getProduct(slug);
  
  if (!productData) {
    notFound();
  }
  
  // Transform API data to internal Product type
  const product: Product = transformProductDetail(productData);
  
  // Get min price for schema
  const prices = productData.product_varient_values.map((v) => v.price);
  const minPrice = Math.min(...prices);
  
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: productData.category.name, href: `/collections/${productData.category.slug}` },
    { label: product.name },
  ];
  
  console.log(`📦 Product Page - Rendering: ${product.name}`);
  console.log(`   Variants: ${productData.product_varient_values.length}`);
  console.log(`   Attributes: ${productData.attributes.length}`);
  
  return (
    <>
      {/* Structured Data */}
      <ProductSchema
        product={{
          name: productData.name,
          description: productData.description || `Handcrafted ${productData.model.name} from Kathmandu`,
          image: productData.feature_image?.url,
          slug: productData.slug,
          sku: productData.id,
          brand: "Nyanopan",
          category: productData.category.name,
          price: minPrice,
          currency: "NPR",
          availability: "InStock",
          condition: "NewCondition",
        }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <div className="bg-background">
        <div className="container-page py-6 lg:py-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="container-page grid gap-10 py-6 lg:grid-cols-2 lg:gap-16 lg:py-10">
          <ProductDetail product={product} productData={productData} />
        </div>

        <div className="border-t">
          <YouMightLike categorySlug={productData.category.slug} excludeSlug={slug} />
        </div>

        <div className="border-t">
          <RelatedProducts model={productData.model.id} excludeSlug={slug} />
        </div>

        <div className="border-t">
          <RecentlyViewed currentSlug={slug} />
        </div>
      </div>
    </>
  );
}

// Transform API data to internal Product type
function transformProductDetail(apiProduct: APIProduct): Product {
  // Get min and max price from variants
  const prices = apiProduct.product_varient_values.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  // Map gender
  const genderMap: Record<string, Product["gender"]> = {
    MEN: "men",
    WOMEN: "women",
    UNISEX: "unisex",
    KIDS: "boys",
    BABY: "boys",
  };
  
  // Extract all unique colors from variants
  const colorSet = new Set<string>();
  const colorImages: Record<string, string | undefined> = {};
  
  apiProduct.attributes.forEach((attr) => {
    if (attr.attribute.name === "Color") {
      attr.attributeValues.forEach((val) => {
        colorSet.add(val.name);
      });
    }
  });
  
  const colors = Array.from(colorSet).map(colorName => ({
    name: colorName,
    value: colorName.toLowerCase(),
    image: colorImages[colorName] || "", // Empty string if no image
  }));
  
  // Extract all unique sizes from variants with their images
  const sizeMap = new Map<string, string>(); // name -> image
  apiProduct.attributes.forEach((attr) => {
    if (attr.attribute.name === "Size" || attr.attribute.name === "Shoes Size") {
      attr.attributeValues.forEach((val) => {
        sizeMap.set(val.name, "");
      });
    }
  });
  
  // Convert to array format with both name and image
  const sizes = Array.from(sizeMap.entries()).map(([name, image]) => ({
    name,
    image,
  })).sort((a, b) => {
    // Try to parse as numbers for sorting
    const aNum = parseInt(a.name);
    const bNum = parseInt(b.name);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    return a.name.localeCompare(b.name);
  });
  
  // Collect all images
  const images: string[] = [apiProduct.feature_image?.url || ""];
  
  // Add additional images if available
  if ('product_images' in apiProduct) {
    const productImages = apiProduct.product_images as Array<{ url: string }>;
    productImages?.forEach((img) => {
      images.push(img.url);
    });
  }
  
  return {
    slug: apiProduct.slug,
    name: apiProduct.name,
    tagline: apiProduct.model?.name || "",
    model: apiProduct.model?.name || "Standard",
    articleNumber: apiProduct.id.substring(0, 8).toUpperCase(),
    price: minPrice,
    compareAtPrice: minPrice !== maxPrice ? maxPrice : undefined,
    gender: genderMap[apiProduct.gender] || "unisex",
    soleType: apiProduct.sole_type === "LEATHER" ? "leather" : "rubber",
    shaftHeight: "low",
    useCase: apiProduct.usage_location === "INSIDE" ? "indoor" : "indoor",
    colors,
    sizes: sizes.length > 0 ? sizes : [
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
    features: (apiProduct.key_features || []).map((feature, index) => ({
      label: `Feature ${index + 1}`,
      value: feature
    })),
    benefits: [],
    description: apiProduct.description ? [apiProduct.description] : [],
    images,
    badge: apiProduct.is_featured ? "Bestseller" : undefined,
    featured: apiProduct.is_featured,
    addedAt: apiProduct.created_at,
    popularity: apiProduct.is_featured ? 100 : 0,
  };
}
