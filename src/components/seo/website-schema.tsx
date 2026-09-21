import { getSiteConfig } from "@/config/site";

export async function WebSiteSchema() {
  const siteConfig = await getSiteConfig();
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nyanopan",
    alternateName: "Nyanopan Store",
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/collections/all?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Nyanopan",
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/brand/logo-cloud.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
