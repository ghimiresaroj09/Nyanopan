import { getSiteConfig } from "@/config/site";

export async function OrganizationSchema() {
  const siteConfig = await getSiteConfig();
  
  // Build social media links array from API config
  const sameAs = siteConfig.social
    ? Object.values(siteConfig.social).filter(Boolean)
    : [];
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nyanopan",
    alternateName: "Nyanopan Store",
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/logo-cloud.png`,
    ...(siteConfig.description && { description: siteConfig.description }),
    ...(siteConfig.contactEmail && { email: siteConfig.contactEmail }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(siteConfig.phone && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
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
