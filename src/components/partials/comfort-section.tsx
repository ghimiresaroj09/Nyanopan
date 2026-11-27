import Image from "next/image";

import { cn } from "@/lib/utils";
import type { HomepageSection2 } from "@/lib/api/homepage";

interface ComfortSectionProps {
  className?: string;
  data?: HomepageSection2 | null;
}

export function ComfortSection({ className, data }: ComfortSectionProps) {
  if (!data) return null;
  const image = data.image?.trim() ?? "";

  return (
    <section className={cn("border-t border-border/60 py-18 md:py-26", className)}>
      <div className={cn("container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20", !image && "lg:grid-cols-1")}>
        {image && (
          <div className="lg:order-2 overflow-hidden rounded-xl border border-border/80 shadow-md">
            <Image
              src={image}
              alt={data.title}
              width={800}
              height={600}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-102"
            />
          </div>
        )}
        <div className="lg:order-1">
          <span className="editorial-eyebrow">{data.tag}</span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight text-foreground">
            {data.title}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            <div dangerouslySetInnerHTML={{ __html: data.description }} />
          </div>

          {data.feature.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/80 pt-6">
              {data.feature.map((feature, index) => (
                <div key={index}>
                  <p className="font-serif text-xl text-foreground font-normal">{feature.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {feature.intro}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
