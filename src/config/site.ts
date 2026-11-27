import { getSiteConfiguration } from "@/lib/api/config";

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

const staticConfig = {
  name: "Nyanopan",
  tagline: "Premium hand felted slippers from Nepal",
  url: resolveSiteUrl(),
  freeShippingThreshold: 150,
} as const;

export interface SiteConfig {
  name: string;
  tagline: string;
  url: string;
  freeShippingThreshold: number;
  description?: string;
  contactEmail?: string;
  phone?: string;
  social?: {
    facebook: string;
    instagram: string;
    tiktok: string;
    pinterest: string;
  };
}

export async function getSiteConfig() {
  const apiConfig = await getSiteConfiguration();

  return {
    ...staticConfig,
    description: apiConfig?.company_intro,
    contactEmail: apiConfig?.email,
    phone: apiConfig?.phone,
    social: apiConfig?.social,
  } satisfies SiteConfig;
}

export const siteConfig = staticConfig;
