import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { HomepageCollectionsData } from "@/lib/api/homepage-collections";

interface CategoryTilesProps {
  data: HomepageCollectionsData | null;
}

export function CategoryTiles({ data }: CategoryTilesProps) {
  if (!data || data.collections.length === 0) return null;

  const tiles = data.collections.map(collection => ({
    title: collection.name,
    description: collection.intro,
    href: collection.link,
    image: collection.image,
    alt: collection.name,
  }));

  return (
    <section className="container-page py-14 md:py-20">
      <div className="mb-10 text-center">
        <span className="editorial-eyebrow">{data.tag}</span>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl text-foreground">
          {data.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
          {data.description}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.title}
            href={tile.href}
            className="group relative block overflow-hidden rounded-lg border border-border/60 bg-muted/30 shadow-xs transition-all hover:border-terracotta/40 hover:shadow-md"
          >
            <div className="overflow-hidden">
              <Image
                src={tile.image}
                alt={tile.alt}
                width={420}
                height={540}
                className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-opacity group-hover:from-black/85"
            />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="font-serif text-2xl text-white tracking-wide">{tile.title}</h3>
              <p className="mt-1 text-xs text-white/80 line-clamp-1">{tile.description}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white underline-offset-4 group-hover:text-amber-200">
                Explore collection
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
