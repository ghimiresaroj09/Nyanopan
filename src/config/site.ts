import { getSiteConfiguration, fallbackConfig } from "@/lib/api/config";

/**
 * Resolves the canonical site URL for metadata, sitemap and robots.
 *
 * Priority:
 *  1. NEXT_PUBLIC_SITE_URL (set explicitly, e.g. after connecting a custom domain)
 *  2. Vercel-provided production URL (automatic on Vercel)
 *  3. Vercel preview URL (automatic on preview deployments)
 *  4. localhost (local development)
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }
  return "http://localhost:3000";
}

// Static fallback values
const staticConfig = {
  name: "Nyanopan",
  tagline: "Premium hand felted slippers from Nepal",
  description: fallbackConfig.company_intro,
  url: resolveSiteUrl(),
  contactEmail: fallbackConfig.email,
  freeShippingThreshold: 150,
} as const;

/**
 * Get site configuration with dynamic values from API
 * Falls back to static config if API fails
 */
export async function getSiteConfig() {
  const apiConfig = await getSiteConfiguration();
  
  if (apiConfig) {
    return {
      ...staticConfig,
      description: apiConfig.company_intro,
      contactEmail: apiConfig.email,
    };
  }
  
  return staticConfig;
}

// For backwards compatibility - use static config for client-side
export const siteConfig = staticConfig;

export type SiteConfig = typeof staticConfig;
