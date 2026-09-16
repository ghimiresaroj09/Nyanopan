"use client";

import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  badge?: string;
}

export function ProductGallery({ images, alt, badge }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-[#faf7f2] p-4 shadow-xs">
        {badge && (
          <Badge
            variant={badge === "Special edition" ? "secondary" : "default"}
            className="absolute left-6 top-6 z-10 text-[10px] tracking-wider uppercase font-medium bg-background/95 text-foreground backdrop-blur-xs border-border/80 shadow-xs"
          >
            {badge}
          </Badge>
        )}
        <Image
          src={images[activeIndex]}
          alt={alt}
          width={1000}
          height={1000}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="aspect-square w-full rounded-lg object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3" role="tablist" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "overflow-hidden rounded-lg border bg-[#faf7f2] p-1.5 transition-all duration-200",
                activeIndex === index
                  ? "border-terracotta ring-1 ring-terracotta shadow-xs"
                  : "border-border/70 opacity-70 hover:opacity-100 hover:border-foreground/30"
              )}
            >
              <Image
                src={image}
                alt=""
                width={200}
                height={200}
                loading="lazy"
                className="aspect-square w-full rounded-sm object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
