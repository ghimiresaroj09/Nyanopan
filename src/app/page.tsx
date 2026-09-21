import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { CategoryTiles } from "@/components/home/category-tiles";
import { FeaturedProducts } from "@/components/home/featured-products";
import { FairTradeSection } from "@/components/partials/fair-trade-section";
import { ComfortSection } from "@/components/partials/comfort-section";
import { SustainabilitySection } from "@/components/partials/sustainability-section";
import { NewsletterSignup } from "@/components/partials/newsletter-signup";
import { OrganizationSchema } from "@/components/seo/organization-schema";
import { getHomepageCollections } from "@/lib/api/homepage-collections";
import { getHomepage } from "@/lib/api/homepage";
import { getSiteConfig } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  
  return {
    title: {
      absolute: `${siteConfig.name} | ${siteConfig.tagline}`,
    },
    description: siteConfig.description.substring(0, 160),
    keywords: [
      // Brand Keywords
      "Nyanopan",
      "Nyanopan Nepal",
      "Nyanopan Kathmandu",
      "Nyanopan wool",
      "Nyanopan felt",
      // Main Products
      "handmade wool products Nepal",
      "handmade felt products Nepal",
      "wool products Nepal",
      "felt products Nepal",
      // Primary Categories
      "wool felt slippers",
      "wool slippers Nepal",
      "handmade wool slippers",
      "wool felt shoes",
      "wool bags Nepal",
      "wool mattress Nepal",
      "felt home decor",
      // Positioning
      "handmade in Nepal",
      "sustainable wool products",
      "natural wool products Nepal",
      "eco friendly products Nepal",
      "fair trade footwear",
      "ethical handmade products",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      title: `${siteConfig.name} | ${siteConfig.tagline}`,
      description: siteConfig.description.substring(0, 160),
      type: "website",
      url: "/",
      images: [
        {
          url: "/brand/slipper_pair.png",
          width: 1200,
          height: 630,
          alt: "Nyanopan handcrafted wool slippers",
        },
      ],
      siteName: "Nyanopan",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} | ${siteConfig.tagline}`,
      description: siteConfig.description.substring(0, 160),
      images: ["/brand/slipper_pair.png"],
    },
  };
}

export default async function HomePage() {
  const collectionsData = await getHomepageCollections();
  const homepageData = await getHomepage();

  return (
    <>
      {/* Structured Data */}
      <OrganizationSchema />
      
      <Hero />
      <CategoryTiles data={collectionsData} />
      <FeaturedProducts />
      <FairTradeSection data={homepageData?.section1} />
      <ComfortSection data={homepageData?.section2} />
      <SustainabilitySection data={homepageData?.section3} />
      <NewsletterSignup />
    </>
  );
}
