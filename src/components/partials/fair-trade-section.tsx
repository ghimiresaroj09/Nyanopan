import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { images } from "@/data/images";
import { cn } from "@/lib/utils";
import type { HomepageSection1 } from "@/lib/api/homepage";

interface FairTradeSectionProps {
  className?: string;
  data?: HomepageSection1 | null;
}

export function FairTradeSection({ className, data }: FairTradeSectionProps) {
  const tag = data?.tag || "Fair Trade Atelier";
  const title = data?.title || "A small workshop that honors its craftspeople";
  const description = data?.description || `Every nyanopan is shaped in a small cooperative workshop in Kathmandu.
              The entire process is human work: natural mountain wool is washed,
              felted by hand using warm water, gently shaped onto wooden lasts, and sun-dried.`;
  const quote = data?.quote || `"Each pair carries the stitched signature of its maker. When you slip into nyanopan, you know exactly whose hands shaped your warmth."`;
  const image = data?.image || images.embroideredSlippers;

  return (
    <section className={cn("border-t border-border/60 bg-muted/30 py-18 md:py-26", className)}>
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <div className="overflow-hidden rounded-xl border border-border/80 shadow-md">
            <Image
              src={image}
              alt={title}
              width={800}
              height={600}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-102"
            />
          </div>
          {/* Subtle craft stamp */}
          <div className="absolute -bottom-5 -right-5 hidden sm:flex flex-col items-center justify-center rounded-full bg-background border border-border p-4 shadow-lg text-center h-28 w-28">
            <span className="font-serif text-lg font-bold text-terracotta leading-none">100%</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mt-1">Fair Trade</span>
            <span className="text-[9px] text-muted-foreground/75">Kathmandu</span>
          </div>
        </div>

        <div>
          <span className="editorial-eyebrow">{tag}</span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight text-foreground">
            {title}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <div dangerouslySetInnerHTML={{ __html: description }} />
            <p className="border-l-2 border-terracotta/70 pl-4 italic text-foreground/90 font-serif">
              &ldquo;{quote}&rdquo;
            </p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <Button asChild variant="outline" className="h-11 px-6 border-border hover:border-terracotta hover:text-terracotta transition-colors">
              <Link href="/our-story">Discover our makers</Link>
            </Button>
            <Link
              href="/sustainability"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              Our certification &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
