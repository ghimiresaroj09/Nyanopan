import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { images } from "@/data/images";
import { cn } from "@/lib/utils";
import type { HomepageSection3 } from "@/lib/api/homepage";

interface SustainabilitySectionProps {
  className?: string;
  data?: HomepageSection3 | null;
}

export function SustainabilitySection({ className, data }: SustainabilitySectionProps) {
  const tag = data?.tag || "Zero Synthetic Compromise";
  const title = data?.title || "Sustainably harvested, zero-waste crafted";
  const description = data?.description || `The wool is sheared humanely and washed without petroleum detergents.
              The wet felting process relies solely on soft mountain water, botanical soap, heat, and hand pressure.`;
  const image = data?.image || images.sheepGreenGrass;

  return (
    <section className={cn("border-t border-border/60 bg-muted/40 py-18 md:py-26", className)}>
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="overflow-hidden rounded-xl border border-border/80 shadow-md">
          <Image
            src={image}
            alt={title}
            width={800}
            height={600}
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-102"
          />
        </div>
        <div>
          <span className="editorial-eyebrow">{tag}</span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight text-foreground">
            {title}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          <div className="mt-8">
            <Button asChild variant="outline" className="h-11 px-6 border-border hover:border-terracotta hover:text-terracotta transition-colors">
              <Link href="/sustainability">Read our environmental standards</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
