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

export const siteConfig = {
  name: "nyanopan",
  tagline: "Premium hand felted slippers from Nepal",
  description:
    "nyanopan makes one-piece wool felt slippers, hand felted in a fair trade workshop in Kathmandu, Nepal. Breathable, temperature regulating and finished with a calf leather or rubber sole.",
  url: resolveSiteUrl(),
  contactEmail: "support@nyanopan-store.example",
  freeShippingThreshold: 150,
} as const;

export type SiteConfig = typeof siteConfig;
