import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { images } from "@/data/images";
import { cn } from "@/lib/utils";

interface FairTradeSectionProps {
  className?: string;
}

export function FairTradeSection({ className }: FairTradeSectionProps) {
  return (
    <section className={cn("border-t border-border/60 bg-muted/30 py-18 md:py-26", className)}>
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <div className="overflow-hidden rounded-xl border border-border/80 shadow-md">
            <Image
              src={images.embroideredSlippers}
              alt="Hand made felt slippers laid out at a market"
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
          <span className="editorial-eyebrow">Fair Trade Atelier</span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight text-foreground">
            A small workshop that honors its craftspeople
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              Every nyanopan is shaped in a small cooperative workshop in Kathmandu.
              The entire process is human work: natural mountain wool is washed,
              felted by hand using warm water, gently shaped onto wooden lasts, and sun-dried.
            </p>
            <p>
              Our artisans earn guaranteed fair living wages. On-site childcare is provided
              at the workshop, and a dedicated education fund finances the schooling of our makers&apos; children.
            </p>
            <p className="border-l-2 border-terracotta/70 pl-4 italic text-foreground/90 font-serif">
              &ldquo;Each pair carries the stitched signature of its maker. When you slip into nyanopan, you know exactly whose hands shaped your warmth.&rdquo;
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
