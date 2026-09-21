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
      "Soft wool felt slippers for women, available in various sizes.",
  },
  {
    slug: "slippers-men",
    title: "Men's Slippers",
    description:
      "Sturdy wool felt slippers for men, available in various sizes.",
  },
  {
    slug: "slippers-kids",
    title: "Kids Slippers",
    description:
      "Warm, flexible slippers for children. Machine-free production, natural materials.",
  },
  {
    slug: "baby-booties",
    title: "Baby Booties",
    description:
      "Soft leather-soled booties for the smallest feet.",
  },
];

export function getCollection(slug: string): CollectionDef | undefined {
  return collections.find((c) => c.slug === slug);
}
