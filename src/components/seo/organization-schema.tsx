import { getSiteConfig } from "@/config/site";
import { getSiteConfiguration, fallbackConfig } from "@/lib/api/config";

export async function OrganizationSchema() {
  const siteConfig = await getSiteConfig();
  const apiConfig = await getSiteConfiguration() || fallbackConfig;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nyanopan",
    alternateName: "Nyanopan Store",
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/logo-cloud.png`,
    description: siteConfig.description,
    email: apiConfig.email,
    telephone: apiConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Boudha, Kathmandu",
      addressCountry: "NP",
      streetAddress: apiConfig.address,
    },
    sameAs: [
      apiConfig.social.facebook,
      apiConfig.social.instagram,
      apiConfig.social.tiktok,
      apiConfig.social.pinterest,
    ].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: apiConfig.phone,
      contactType: "Customer Service",
      email: apiConfig.email,
      availableLanguage: ["English", "Nepali"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
