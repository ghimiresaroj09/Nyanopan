"use client";

import { useState } from "react";
import { Check, Heart, Ruler } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cart } from "@/hooks/use-cart";
import { useWishlistHas, wishlist } from "@/hooks/use-wishlist";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductBuyBoxProps {
  product: Product;
}

export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState<number | null>(null);
  const wishlisted = useWishlistHas(product.slug);

  const color = product.colors[colorIndex];

  function handleAddToCart() {
    if (size === null) {
      toast.error("Please select a size first.");
      return;
    }
    cart.add(product, color.name, color.image, size);
    toast.success(`${product.name} added to your cart.`);
  }

  function toggleWishlist() {
    const added = wishlist.toggle(product.slug);
    if (added) {
      toast.success("Added to your wishlist.");
    } else {
      toast.success("Removed from your wishlist.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="editorial-eyebrow">Kathmandu Atelier</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-[40px] leading-tight font-normal text-foreground">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{product.tagline}</p>
        <p className="mt-4 font-serif text-2xl font-normal text-foreground">{formatPrice(product.price)}</p>
      </div>

      <Separator className="border-border/80" />

      {/* Colour */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wider font-semibold text-foreground">
            Colour &mdash; <span className="font-normal text-muted-foreground normal-case tracking-normal">{color.name}</span>
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {product.colors.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setColorIndex(index)}
              aria-pressed={index === colorIndex}
              aria-label={option.name}
              className={cn(
                "overflow-hidden rounded-lg border bg-[#faf7f2] p-1 transition-all duration-200",
                index === colorIndex
                  ? "border-terracotta ring-2 ring-terracotta/80 shadow-xs"
                  : "border-border/80 hover:border-foreground/40"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={option.image}
                alt={option.name}
                className="h-14 w-14 rounded-md object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wider font-semibold text-foreground">Size (EU)</p>
          <SizeGuideDialog />
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-7">
          {product.sizes.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSize(option)}
              aria-pressed={size === option}
              className={cn(
                "h-10 rounded-md border text-xs font-medium transition-all duration-150",
                size === option
                  ? "border-primary bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "border-border/80 bg-background hover:border-foreground/40 hover:bg-muted/40"
              )}
            >
              {option}
            </button>
          ))}
        </div>
        {size === null && (
          <p className="mt-2 text-xs text-muted-foreground">Select an EU size to check availability.</p>
        )}
      </div>

      {/* Add to cart and wishlist */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-2.5">
          <Button
            size="lg"
            className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm tracking-wide shadow-xs"
            onClick={handleAddToCart}
          >
            Add to cart &mdash; {formatPrice(product.price)}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 w-12 px-0 border-border/80 hover:border-terracotta hover:text-terracotta"
            aria-pressed={wishlisted}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={toggleWishlist}
          >
            <Heart className={cn("h-5 w-5", wishlisted && "fill-terracotta text-terracotta")} />
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Free shipping from Rs. 150 &middot; 30-day fair returns policy
        </p>
      </div>

      {/* Benefits */}
      <div className="rounded-lg border border-border/70 bg-[#fbf8f2] p-4.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-terracotta mb-3">Atelier Standards</p>
        <ul className="space-y-2.5">
          {product.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const SIZE_GUIDE = [
  { size: "35", footLength: "22.5 cm" },
  { size: "36", footLength: "23.0 cm" },
  { size: "37", footLength: "23.5 cm" },
  { size: "38", footLength: "24.0 cm" },
  { size: "39", footLength: "24.5 cm" },
  { size: "40", footLength: "25.2 cm" },
  { size: "41", footLength: "25.8 cm" },
  { size: "42", footLength: "26.5 cm" },
  { size: "43", footLength: "27.1 cm" },
  { size: "44", footLength: "27.8 cm" },
  { size: "45", footLength: "28.4 cm" },
  { size: "46", footLength: "29.1 cm" },
  { size: "47", footLength: "29.7 cm" },
  { size: "48", footLength: "30.4 cm" },
];

function SizeGuideDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
        >
          <Ruler className="h-4 w-4" />
          Size guide
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Size guide</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          nyanopan slippers are felted on a wide last. Foot lengths are approximate;
          when in doubt, choose the larger size.
        </p>
        <div className="max-h-72 overflow-y-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted text-left">
              <tr>
                <th className="px-4 py-2 font-medium">EU size</th>
                <th className="px-4 py-2 font-medium">Foot length</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {SIZE_GUIDE.map((row) => (
                <tr key={row.size}>
                  <td className="px-4 py-2">{row.size}</td>
                  <td className="px-4 py-2 text-muted-foreground">{row.footLength}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
