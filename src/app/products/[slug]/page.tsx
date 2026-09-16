import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductBuyBox } from "@/components/product/product-buy-box";
import { RelatedProducts } from "@/components/product/related-products";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { getProductBySlug, products } from "@/data/products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description[0] ?? product.tagline,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

/* The catalogue is fully static; unknown slugs return a 404. */
export const dynamicParams = false;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description.join(" "),
    brand: { "@type": "Brand", name: "nyanopan" },
    sku: product.articleNumber,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-page py-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "All Slippers", href: "/collections/all-slippers" },
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-page grid gap-10 pb-16 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images} alt={product.name} badge={product.badge} />
        <ProductBuyBox product={product} />
      </div>

      <section className="container-page pb-16" aria-label="Product details">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h2 className="font-serif text-2xl text-foreground">Description</h2>
            {product.description.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <div>
            <h2 className="font-serif text-2xl">Features</h2>
            <dl className="mt-4 divide-y border-t">
              {product.features.map((feature) => (
                <div key={feature.label} className="flex justify-between gap-6 py-2.5 text-sm">
                  <dt className="text-muted-foreground">{feature.label}</dt>
                  <dd className="text-right font-medium">{feature.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/40">
        <div className="container-page py-14">
          <h2 className="font-serif text-2xl">More colours of the {product.model}</h2>
          <div className="mt-6">
            <RelatedProducts model={product.model} excludeSlug={product.slug} />
          </div>
        </div>
      </section>

      <RecentlyViewed currentSlug={product.slug} />
    </>
  );
}
