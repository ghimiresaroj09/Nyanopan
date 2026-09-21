import { getSiteConfig } from "@/config/site";

interface CollectionSchemaProps {
  collection: {
    name: string;
    description: string;
    slug: string;
    numberOfItems: number;
  };
}

export async function CollectionSchema({ collection }: CollectionSchemaProps) {
  const siteConfig = await getSiteConfig();
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${collection.name} Collection`,
    description: collection.description,
    url: `${siteConfig.url}/collections/${collection.slug}`,
    mainEntity: {
      "@type": "ItemList",
      name: `${collection.name} Products`,
      description: collection.description,
      numberOfItems: collection.numberOfItems,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: collection.name,
          item: `${siteConfig.url}/collections/${collection.slug}`,
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
