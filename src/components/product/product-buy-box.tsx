"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cart } from "@/hooks/use-cart";
import { useWishlistHas, wishlist } from "@/hooks/use-wishlist";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductBuyBoxProps {
  product: Product;
  productData?: any; // Optional API product data with variants
  colorIndex?: number; // Controlled color index
  onColorChange?: (index: number) => void; // Color change handler
  onSpecialEditionChange?: (isSpecial: boolean) => void; // Special edition state callback
}

// Helper function to get available sizes for a selected color
function getAvailableSizesForColor(variants: any[], colorName: string, allSizes: any[]): any[] {
  const sizesForColor = new Set<string>();
  
  variants.forEach((variant) => {
    // Check if this variant has the selected color
    const hasColor = variant.attributes.some((attr: any) => 
      attr.attribute.name === "Color" && 
      attr.attributeValues.some((val: any) => val.name === colorName)
    );
    
    if (hasColor) {
      // Extract size from this variant
      variant.attributes.forEach((attr: any) => {
        if (attr.attribute.name === "Size" || attr.attribute.name === "Shoes Size") {
          attr.attributeValues.forEach((val: any) => {
            sizesForColor.add(val.name);
          });
        }
      });
    }
  });
  
  // Filter allSizes to only include available sizes, preserving their images
  return allSizes.filter(size => sizesForColor.has(size.name));
}

export function ProductBuyBox({ product, productData, colorIndex: controlledColorIndex, onColorChange, onSpecialEditionChange }: ProductBuyBoxProps) {
  const [internalColorIndex, setInternalColorIndex] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const wishlisted = useWishlistHas(product.slug);

  // Use controlled or internal state
  const colorIndex = controlledColorIndex !== undefined ? controlledColorIndex : internalColorIndex;
  const setColorIndex = onColorChange || setInternalColorIndex;
  
  const color = product.colors[colorIndex];
  
  // Calculate available sizes for selected color from variants
  const availableSizes = productData?.product_varient_values 
    ? getAvailableSizesForColor(productData.product_varient_values, color.name, product.sizes)
    : product.sizes;
  
  // Set default size to first available size if none selected
  useEffect(() => {
    if (size === null && availableSizes.length > 0) {
      setSize(availableSizes[0].name);
    }
  }, [availableSizes, size]);
  
  // Reset size if it's not available for the selected color
  useEffect(() => {
    if (size !== null && !availableSizes.some(s => s.name === size)) {
      // Try to select the first available size
      if (availableSizes.length > 0) {
        setSize(availableSizes[0].name);
      } else {
        setSize(null);
      }
    }
  }, [colorIndex, availableSizes, size]);
  
  // If we have product data with variants, calculate actual price for selected variant
  let currentPrice = product.price;
  let comparePrice = product.compareAtPrice;
  let isSpecialEdition = false;
  
  if (productData?.product_varient_values && color && size) {
    // Find variant matching selected color and size
    const variant = productData.product_varient_values.find((v: any) => {
      const hasColor = v.attributes.some((attr: any) => 
        attr.attribute.name === "Color" && 
        attr.attributeValues.some((val: any) => val.name === color.name)
      );
      const hasSize = v.attributes.some((attr: any) => 
        (attr.attribute.name === "Size" || attr.attribute.name === "Shoes Size") && 
        attr.attributeValues.some((val: any) => val.name === size)
      );
      return hasColor && hasSize;
    });
    
    if (variant) {
      currentPrice = parseFloat(variant.price);
      isSpecialEdition = variant.isSpecialEdition === true;
    }
  }
  
  // Notify parent component when special edition status changes
  useEffect(() => {
    if (onSpecialEditionChange) {
      onSpecialEditionChange(isSpecialEdition);
    }
  }, [isSpecialEdition, onSpecialEditionChange]);

  function handleAddToCart() {
    if (size === null) {
      toast.error("Please select a size first.");
      return;
    }
    
    // Get the selected size object to check for variant featured image
    const selectedSize = availableSizes.find(s => s.name === size);
    
    // Priority: 1. Variant featured image (size.image), 2. Color image, 3. Product's first image
    const cartImage = selectedSize?.image || color.image || product.images[0];
    
    cart.add(product, color.name, cartImage, size, 1, { unitPrice: currentPrice });
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
        <span className="editorial-eyebrow">Nyanopan</span>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-[40px] leading-tight font-normal text-foreground">
          {product.name}
        </h1>
        {product.description && product.description.length > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">{product.description[0]}</p>
        )}
        <div className="mt-4 flex items-center gap-3">
          <p className="font-serif text-2xl font-normal text-foreground">{formatPrice(currentPrice)}</p>
          {isSpecialEdition && (
            <Badge variant="secondary" className="text-[10px] tracking-wider uppercase font-medium">
              Special Edition
            </Badge>
          )}
        </div>
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
                "overflow-hidden rounded-lg border transition-all duration-200",
                index === colorIndex
                  ? "border-terracotta ring-2 ring-terracotta/80 shadow-xs"
                  : "border-border/80 hover:border-foreground/40",
                option.image ? "bg-[#faf7f2] p-1" : "bg-background px-3 py-2"
              )}
            >
              {option.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={option.image}
                  alt={option.name}
                  className="h-14 w-14 rounded-md object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-xs font-medium text-foreground">{option.name}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wider font-semibold text-foreground">
            Size {size ? <span className="font-normal text-muted-foreground normal-case tracking-normal">&mdash; {size}</span> : null}
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {availableSizes.map((option) => (
            <button
              key={option.name}
              type="button"
              onClick={() => setSize(option.name)}
              aria-pressed={size === option.name}
              aria-label={`Size ${option.name}`}
              className={cn(
                "overflow-hidden rounded-lg border transition-all duration-200",
                size === option.name
                  ? "border-terracotta ring-2 ring-terracotta/80 shadow-xs"
                  : "border-border/80 hover:border-foreground/40",
                option.image ? "bg-[#faf7f2] p-1" : "bg-background px-3 py-2"
              )}
            >
              {option.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={option.image}
                  alt={`Size ${option.name}`}
                  className="h-14 w-14 rounded-md object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-xs font-medium text-foreground">{option.name}</span>
              )}
            </button>
          ))}
        </div>
        {size === null && (
          <p className="mt-2 text-xs text-muted-foreground">Select a size to check availability.</p>
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
            Add to cart &mdash; {formatPrice(currentPrice)}
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
      </div>

      {/* Product Details */}
      {productData && (
        <div className="rounded-lg border border-border/70 bg-[#fbf8f2] p-4.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-terracotta mb-3">Product Details</p>
          <div className="space-y-2.5">
            {productData.category?.name && (
              <div className="flex items-start gap-2.5 text-xs leading-relaxed">
                <span className="font-medium text-foreground min-w-[80px]">Category:</span>
                <span className="text-muted-foreground">{productData.category.name}</span>
              </div>
            )}
            {productData.model?.name && (
              <div className="flex items-start gap-2.5 text-xs leading-relaxed">
                <span className="font-medium text-foreground min-w-[80px]">Model:</span>
                <span className="text-muted-foreground">{productData.model.name}</span>
              </div>
            )}
            {productData.gender && (
              <div className="flex items-start gap-2.5 text-xs leading-relaxed">
                <span className="font-medium text-foreground min-w-[80px]">Gender:</span>
                <span className="text-muted-foreground">{productData.gender}</span>
              </div>
            )}
            {productData.sole_type && (
              <div className="flex items-start gap-2.5 text-xs leading-relaxed">
                <span className="font-medium text-foreground min-w-[80px]">Sole Type:</span>
                <span className="text-muted-foreground">{productData.sole_type}</span>
              </div>
            )}
            {productData.usage_location && (
              <div className="flex items-start gap-2.5 text-xs leading-relaxed">
                <span className="font-medium text-foreground min-w-[80px]">Usage:</span>
                <span className="text-muted-foreground">{productData.usage_location}</span>
              </div>
            )}
            {productData.materials_used && (
              <div className="flex items-start gap-2.5 text-xs leading-relaxed">
                <span className="font-medium text-foreground min-w-[80px]">Materials:</span>
                <span className="text-muted-foreground">{productData.materials_used}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key Features */}
      {productData?.key_features && productData.key_features.length > 0 && (
        <div className="rounded-lg border border-border/70 bg-[#fbf8f2] p-4.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-terracotta mb-3">Features</p>
          <div className="space-y-3">
            {productData.key_features.map((feature: any, index: number) => {
              // Handle both string format and object format
              let title = '';
              let value = '';
              
              if (typeof feature === 'string') {
                // If it's a string, use it as value only
                value = feature;
              } else if (feature.title && feature.value) {
                // If it has both title and value
                title = feature.title;
                value = feature.value;
              } else if (feature.title) {
                // If it only has title
                value = feature.title;
              } else if (feature.value) {
                // If it only has value
                value = feature.value;
              } else {
                value = JSON.stringify(feature);
              }
              
              return (
                <div 
                  key={index} 
                  className="flex items-start justify-between gap-4 text-xs leading-relaxed border-b border-border/30 pb-3 last:border-0 last:pb-0"
                >
                  {title && (
                    <span className="text-foreground font-medium">{title}</span>
                  )}
                  <span className={cn(
                    "text-muted-foreground text-right",
                    !title && "w-full"
                  )}>{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
