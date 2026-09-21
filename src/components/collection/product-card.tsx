"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { ProductQuickAddDialog } from "@/components/product/product-quick-add-dialog";
import { useWishlistHas, wishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const wishlisted = useWishlistHas(product.slug);
  const [primary, secondary] = product.images;

  function toggleWishlist() {
    const added = wishlist.toggle(product.slug);
    if (added) {
      toast.success("Added to your wishlist.");
    } else {
      toast.success("Removed from your wishlist.");
    }
  }

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-lg border border-border/70 bg-[#faf7f2] shadow-xs transition-all duration-300 group-hover:border-terracotta/40 group-hover:shadow-md">
          {product.badge && (
            <Badge
              variant={product.badge === "Special edition" ? "secondary" : "default"}
              className="absolute left-3 top-3 z-10 text-[10px] tracking-wider uppercase font-medium bg-background/95 text-foreground backdrop-blur-xs border-border/80 shadow-xs"
            >
              {product.badge}
            </Badge>
          )}
          <div className="p-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-[#f5f1e8]">
              <Image
                src={primary}
                alt={product.name}
                width={600}
                height={600}
                priority={priority}
                className={cn(
                  "h-full w-full object-cover transition-all duration-500",
                  secondary 
                    ? "group-hover:opacity-0" 
                    : "group-hover:scale-105"
                )}
              />
              {secondary && (
                <Image
                  src={secondary}
                  alt=""
                  aria-hidden="true"
                  width={600}
                  height={600}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </div>
          </div>
        </div>
        <div className="mt-3.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[13.5px] font-medium leading-snug text-foreground transition-colors group-hover:text-terracotta">
              {product.name}
            </h3>
            <p className="whitespace-nowrap font-serif text-[15px] font-normal text-foreground">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>

      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={toggleWishlist}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/95 shadow-xs transition-all hover:bg-background hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            wishlisted
              ? "opacity-100 text-terracotta"
              : "lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100 text-muted-foreground hover:text-foreground"
          )}
        >
          <Heart
            className={cn("h-3.5 w-3.5", wishlisted && "fill-terracotta text-terracotta")}
          />
        </button>
        <button
          type="button"
          onClick={() => setQuickAddOpen(true)}
          aria-label={`Quick add ${product.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background/95 shadow-xs transition-all hover:bg-background hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100 text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <ProductQuickAddDialog
        product={product}
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
      />
    </div>
  );
}
