import { getSiteConfig } from "@/config/site";

interface ProductSchemaProps {
  product: {
    name: string;
    description?: string;
    image?: string;
    slug: string;
    sku?: string;
    brand: string;
    category?: string;
    price: number;
    currency: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder";
    condition?: "NewCondition" | "UsedCondition" | "RefurbishedCondition";
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
    url: `${siteConfig.url}/products/${product.slug}`,
    ...(product.description ? { description: product.description } : {}),
    ...(product.image ? { image: product.image } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    ...(product.category ? { category: product.category } : {}),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      url: `${siteConfig.url}/products/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "Nyanopan",
      },
      ...(product.availability
        ? { availability: `https://schema.org/${product.availability}` }
        : {}),
      ...(product.condition
        ? { itemCondition: `https://schema.org/${product.condition}` }
        : {}),
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
