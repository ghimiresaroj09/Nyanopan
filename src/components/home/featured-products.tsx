import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductCard } from "@/components/collection/product-card";
import { products } from "@/data/products";

export function FeaturedProducts() {
  const featured = products.filter((p) => p.featured).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="container-page pb-16 md:pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <span className="editorial-eyebrow">Signature Works</span>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl tracking-tight text-foreground">Featured slippers</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Four iconic silhouettes from the Kathmandu atelier, hand-felted from untreated Himalayan wool.
          </p>
        </div>
        <Link
          href="/collections/all-slippers"
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground hover:text-terracotta transition-colors"
        >
          View all 22 models
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
