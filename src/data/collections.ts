import type { CollectionDef } from "@/types/collection";

export const collections: CollectionDef[] = [
  {
    slug: "all-slippers",
    title: "All Slippers",
    description:
      "Every nyanopan model, in every colour. Hand felted from 100% natural wool in Kathmandu, Nepal.",
  },
  {
    slug: "high-cut-slippers",
    title: "High-Cut Slippers",
    description:
      "Slippers with a raised shaft that wraps around the ankle. Extra warmth for colder days.",
  },
  {
    slug: "slip-on-slippers",
    title: "Slip-On Slippers",
    description:
      "Low, open-entry slippers that slide on in a second. Designed for everyday indoor use.",
  },
  {
    slug: "slippers-women",
    title: "Women's Slippers",
    description:
      "Soft wool felt slippers for women, available in sizes EU 35 to EU 42.",
  },
  {
    slug: "slippers-men",
    title: "Men's Slippers",
    description:
      "Sturdy wool felt slippers for men, available in sizes EU 40 to EU 48.",
  },
  {
    slug: "slippers-kids",
    title: "Kids Slippers",
    description:
      "Warm, flexible slippers for children, in sizes EU 25 to EU 33. Machine-free production, natural materials.",
  },
  {
    slug: "baby-booties",
    title: "Baby Booties",
    description:
      "Soft leather-soled booties for the smallest feet, in sizes EU 17 to EU 24.",
  },
];

export function getCollection(slug: string): CollectionDef | undefined {
  return collections.find((c) => c.slug === slug);
}
