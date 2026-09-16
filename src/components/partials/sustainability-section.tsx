import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { images } from "@/data/images";
import { cn } from "@/lib/utils";

interface SustainabilitySectionProps {
  className?: string;
}

export function SustainabilitySection({ className }: SustainabilitySectionProps) {
  return (
    <section className={cn("border-t border-border/60 bg-muted/40 py-18 md:py-26", className)}>
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="overflow-hidden rounded-xl border border-border/80 shadow-md">
          <Image
            src={images.sheepGreenGrass}
            alt="Sheep grazing freely in green mountain pastures"
            width={800}
            height={600}
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-102"
          />
        </div>
        <div>
          <span className="editorial-eyebrow">Zero Synthetic Compromise</span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight text-foreground">
            Sustainably harvested, zero-waste crafted
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              The wool is sheared humanely and washed without petroleum detergents.
              The wet felting process relies solely on soft mountain water, botanical soap, heat, and hand pressure.
            </p>
            <p>
              Leftover wool scraps are systematically collected and re-felted into vibrant multi-tonal
              sheets for our limited Lungta editions—achieving a closed loop where zero raw wool is discarded.
            </p>
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
