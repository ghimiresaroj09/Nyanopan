import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionBrowser } from "@/components/collection/collection-browser";
import { PageHeader } from "@/components/shared/page-header";
import { getCollection, collections } from "@/data/collections";
import { getProductsByCollection } from "@/data/products";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
  };
}

export async function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

/* The catalogue is fully static; unknown slugs return a 404. */
export const dynamicParams = false;

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const initialProducts = getProductsByCollection(slug);

  return (
    <>
      <PageHeader
        title={collection.title}
        description={collection.description}
        crumbs={[{ label: "Home", href: "/" }, { label: collection.title }]}
      />
      <CollectionBrowser collectionSlug={slug} initialProducts={initialProducts} />
    </>
  );
}
