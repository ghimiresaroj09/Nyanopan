"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductQuickAddDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Compact variant picker shown from a product card. Adding here keeps
 * the cart drawer closed; the header badge and a toast give feedback.
 */
export function ProductQuickAddDialog({
  product,
  open,
  onOpenChange,
}: ProductQuickAddDialogProps) {
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setColorIndex(0);
      setSize(null);
    }
  }, [open, product.slug]);

  const color = product.colors[colorIndex];

  function handleAddToCart() {
    if (size === null) {
      toast.error("Please select a size first.");
      return;
    }
    cart.add(product, color.name, color.image, size, 1, { openDrawer: false });
    toast.success(`${product.name} added to your cart.`);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
        <div className="grid gap-5 sm:grid-cols-[200px_1fr] sm:items-start">
          <div className="relative overflow-hidden rounded-lg border border-border/80 bg-muted/20">
            <Image
              src={color.image}
              alt={product.name}
              width={400}
              height={300}
              className="aspect-square w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <DialogTitle className="text-lg font-serif font-normal text-foreground">
                {product.name}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-xs text-muted-foreground">
                {product.tagline}
              </DialogDescription>
              <p className="mt-1.5 font-serif text-lg font-medium text-foreground">
                {formatPrice(product.price)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Colour: <span className="font-normal normal-case text-muted-foreground">{color.name}</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColorIndex(index)}
                    aria-pressed={index === colorIndex}
                    aria-label={option.name}
                    className={cn(
                      "overflow-hidden rounded-md border p-0.5 transition-all",
                      index === colorIndex
                        ? "border-primary ring-2 ring-primary"
                        : "border-border hover:border-foreground/40"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={option.image}
                      alt={option.name}
                      className="h-8 w-8 rounded-sm object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Size {size ? <span className="font-mono text-terracotta normal-case">EU {size}</span> : null}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.sizes.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSize(option)}
                    aria-pressed={size === option}
                    className={cn(
                      "h-8 min-w-9 rounded-md border px-2 text-xs font-medium transition-colors",
                      size === option
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/80 hover:border-foreground/40 hover:bg-accent/40"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-border/70">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm font-medium"
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full h-8 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => onOpenChange(false)}
              >
                <Link href={`/products/${product.slug}`}>View full product details &rarr;</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
