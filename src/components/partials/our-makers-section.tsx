import Image from "next/image";

import { makers } from "@/data/makers";
import { cn } from "@/lib/utils";

interface OurMakersSectionProps {
  className?: string;
}

export function OurMakersSection({ className }: OurMakersSectionProps) {
  return (
    <section className={cn("border-t border-border/70 bg-[#f7f2e8]/80 py-18 md:py-24", className)}>
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="editorial-eyebrow">The Hands Behind Nyanopan</span>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl text-foreground">Our makers</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Our atelier is small by choice. Every single craftsperson can felt,
            shape, block and stitch a pair from raw fleece to completed sole.
            Each slipper carries the stitched signature initials of the artisan who shaped it.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">
          {makers.map((maker) => (
            <figure key={maker.name} className="group">
              <div className="relative overflow-hidden rounded-lg border border-border/80 shadow-xs transition-all duration-300 group-hover:border-terracotta/40 group-hover:shadow-md">
                <Image
                  src={maker.image}
                  alt={`${maker.name}, ${maker.role.toLowerCase()}`}
                  width={400}
                  height={533}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-104"
                />
              </div>
              <figcaption className="mt-3.5">
                <p className="font-serif text-base font-medium text-foreground">{maker.name}</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  {maker.role}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {maker.description}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
