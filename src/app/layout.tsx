import type { Metadata } from "next";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/providers";
import { WebSiteSchema } from "@/components/seo/website-schema";
import { getSiteConfig } from "@/config/site";
import { getCategories } from "@/lib/api/categories";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  const SITE_TITLE = `${siteConfig.name} | ${siteConfig.tagline}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: SITE_TITLE,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: SITE_TITLE,
      description: siteConfig.description,
      url: siteConfig.url,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${siteConfig.name}: ${siteConfig.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_TITLE,
      description: siteConfig.description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    /*
     * suppressHydrationWarning on the root elements: browser extensions
     * (device emulators, translators, dark-mode tools) mutate <html> and
     * <body> before React hydrates, which otherwise logs a false
     * hydration mismatch. Suppression applies to these elements only;
     * mismatches deeper in the tree still warn.
     */
    <html lang="en" suppressHydrationWarning>
      <head>
        <WebSiteSchema />
      </head>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:shadow-md focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <Providers>
          <Header categories={categories} />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
