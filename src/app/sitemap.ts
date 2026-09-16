import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { collections } from "@/data/collections";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/our-story",
    "/sustainability",
    "/shipping",
    "/exchanges-returns",
    "/privacy-policy",
    "/terms-conditions",
    "/cart",
    "/checkout",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.5,
  }));

  const collectionRoutes = collections.map((collection) => ({
    url: `${siteConfig.url}/collections/${collection.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productRoutes = products.map((product) => ({
    url: `${siteConfig.url}/products/${product.slug}`,
    lastModified: new Date(product.addedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
