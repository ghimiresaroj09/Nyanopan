import { getSiteConfig } from "@/config/site";
import { getSiteConfiguration } from "@/lib/api/config";

export async function OrganizationSchema() {
  const siteConfig = await getSiteConfig();
  const apiConfig = await getSiteConfiguration();
  
  // Build social media links array from API config
  const sameAs = apiConfig?.social 
    ? Object.values(apiConfig.social).filter(url => url && url !== "https://facebook.com" && url !== "https://instagram.com")
    : [];
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nyanopan",
    alternateName: "Nyanopan Store",
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/logo-cloud.png`,
    description: siteConfig.description,
    email: apiConfig?.email || siteConfig.contactEmail,
    ...(sameAs.length > 0 && { sameAs }),
    ...(apiConfig?.phone && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: apiConfig.phone,
        contactType: "Customer Service",
        areaServed: "NP",
        availableLanguage: ["en", "ne"],
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
