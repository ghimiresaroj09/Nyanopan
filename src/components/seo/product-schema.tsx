import { getSiteConfig } from "@/config/site";

interface ProductSchemaProps {
  product: {
    name: string;
    description: string;
    image: string;
    slug: string;
    sku?: string;
    brand: string;
    category: string;
    price: number;
    currency: string;
    availability: "InStock" | "OutOfStock" | "PreOrder";
    condition: "NewCondition" | "UsedCondition" | "RefurbishedCondition";
    aggregateRating?: {
      ratingValue: number;
      reviewCount: number;
    };
  };
}

export async function ProductSchema({ product }: ProductSchemaProps) {
  const siteConfig = await getSiteConfig();
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${siteConfig.url}/products/${product.slug}`,
    sku: product.sku || product.slug,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: `https://schema.org/${product.availability}`,
      url: `${siteConfig.url}/products/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "Nyanopan",
      },
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
      itemCondition: `https://schema.org/${product.condition}`,
    },
    ...(product.aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.aggregateRating.ratingValue,
        reviewCount: product.aggregateRating.reviewCount,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
