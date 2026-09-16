import Image from "next/image";

import { images } from "@/data/images";
import { cn } from "@/lib/utils";

interface ComfortSectionProps {
  className?: string;
}

export function ComfortSection({ className }: ComfortSectionProps) {
  return (
    <section className={cn("border-t border-border/60 py-18 md:py-26", className)}>
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="lg:order-2 overflow-hidden rounded-xl border border-border/80 shadow-md">
          <Image
            src={images.feetInSlippers}
            alt="Feet relaxing in wool felt slippers"
            width={800}
            height={600}
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-102"
          />
        </div>
        <div className="lg:order-1">
          <span className="editorial-eyebrow">Natural Fiber Science</span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight text-foreground">
            Warm when it freezes, cool when it warms
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              The seamless single-piece construction eliminates irritating interior seams.
              Crafted from 100% natural mountain wool from free-grazing sheep, each pair acts
              as a natural microclimate for your feet.
            </p>
            <p>
              Unlike synthetic fleece, sheep wool fibers contain microscopic air pockets that insulate
              against cold while actively absorbing moisture from the skin—letting you wear them barefoot
              all year round without odor or overheating.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/80 pt-6">
            <div>
              <p className="font-serif text-xl text-foreground font-normal">Italian Calfskin</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Vegetable-tanned leather soles for silent glide on wooden and tiled floors.
              </p>
            </div>
            <div>
              <p className="font-serif text-xl text-foreground font-normal">Natural Crepe Rubber</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Durable, water-resistant traction for stepped verandas and morning garden walks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
