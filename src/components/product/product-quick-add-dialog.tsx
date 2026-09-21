"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { getProduct } from "@/lib/api/products";

interface ProductQuickAddDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface VariantAttribute {
  name: string;
  values: Array<{
    name: string;
    image?: string;
  }>;
}

// Transform API variants into structured attributes
function extractVariantAttributes(variants: any[]): VariantAttribute[] {
  const attributeMap = new Map<string, Set<string>>();
  const attributeImages = new Map<string, Map<string, string>>();

  variants.forEach((variant) => {
    variant.attributes.forEach((attr: any) => {
      const attrName = attr.attribute.name;
      
      if (!attributeMap.has(attrName)) {
        attributeMap.set(attrName, new Set());
        attributeImages.set(attrName, new Map());
      }

      attr.attributeValues.forEach((val: any) => {
        attributeMap.get(attrName)!.add(val.name);
        
        // Store featured image if available
        if (val.featured_image) {
          attributeImages.get(attrName)!.set(val.name, val.featured_image);
        }
      });
    });
  });

  const attributes: VariantAttribute[] = [];
  
  attributeMap.forEach((values, name) => {
    const imageMap = attributeImages.get(name)!;
    attributes.push({
      name,
      values: Array.from(values).map(v => ({
        name: v,
        image: imageMap.get(v),
      })),
    });
  });

  return attributes;
}

// Get available values for an attribute based on current selections
function getAvailableValues(
  variants: any[],
  attributeName: string,
  currentSelections: Record<string, string>
): string[] {
  const available = new Set<string>();

  variants.forEach((variant) => {
    // Check if this variant matches all current selections (except the attribute we're filtering)
    const matchesSelections = Object.entries(currentSelections).every(([selAttrName, selValue]) => {
      if (selAttrName === attributeName) return true;
      
      return variant.attributes.some((attr: any) =>
        attr.attribute.name === selAttrName &&
        attr.attributeValues.some((val: any) => val.name === selValue)
      );
    });

    if (matchesSelections) {
      variant.attributes.forEach((attr: any) => {
        if (attr.attribute.name === attributeName) {
          attr.attributeValues.forEach((val: any) => {
            available.add(val.name);
          });
        }
      });
    }
  });

  return Array.from(available);
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
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [variantAttributes, setVariantAttributes] = useState<VariantAttribute[]>([]);

  // Fetch product data when dialog opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      setProductData(null);
      setSelections({});
      
      getProduct(product.slug).then((data) => {
        if (!data) {
          setLoading(false);
          return;
        }
        
        setProductData(data);
        
        // Extract variant attributes from API
        if (data.product_varient_values?.length > 0) {
          const attributes = extractVariantAttributes(data.product_varient_values);
          setVariantAttributes(attributes);
          
          // Find the variant that matches the product card price
          const cardPrice = product.price;
          const matchingVariant = data.product_varient_values.find(
            (v: any) => Math.abs(parseFloat(v.price) - cardPrice) < 0.01
          ) || data.product_varient_values[0]; // Fallback to first variant
          
          // Build selections from the matching variant
          const initialSelections: Record<string, string> = {};
          matchingVariant.attributes.forEach((attr: any) => {
            const attrName = attr.attribute.name;
            const firstValue = attr.attributeValues[0]?.name;
            if (firstValue) {
              initialSelections[attrName] = firstValue;
            }
          });
          
          setSelections(initialSelections);
        }
        
        setLoading(false);
      });
    }
  }, [open, product.slug, product.price]);

  // Find current variant based on selections
  const currentVariant = productData?.product_varient_values?.find((v: any) => {
    return Object.entries(selections).every(([attrName, selectedValue]) => {
      return v.attributes.some((attr: any) =>
        attr.attribute.name === attrName &&
        attr.attributeValues.some((val: any) => val.name === selectedValue)
      );
    });
  });

  const currentPrice = currentVariant ? parseFloat(currentVariant.price) : product.price;
  const isSpecialEdition = currentVariant?.isSpecialEdition === true;

  // Get display image: Priority: 1. Current variant featured image, 2. First variant image, 3. Product color image
  const primaryImage = currentVariant?.featured_image || 
    productData?.product_varient_values?.[0]?.featured_image || 
    product.colors[0]?.image ||
    product.images?.[0] ||
    '';

  function handleAttributeChange(attributeName: string, value: string) {
    setSelections(prev => ({ ...prev, [attributeName]: value }));
  }

  function handleAddToCart() {
    // Find color and size from selections
    const colorName = selections.Color || selections.Colour || "";
    const sizeName = selections.Size || selections["Shoes Size"] || "";
    
    if (!colorName || !sizeName) {
      toast.error("Please select all options.");
      return;
    }

    // Priority: 1. Variant featured image (currentVariant), 2. Color image, 3. Primary image fallback
    const variantFeaturedImage = currentVariant?.featured_image;
    const colorAttr = variantAttributes.find(a => a.name === "Color" || a.name === "Colour");
    const colorValue = colorAttr?.values.find(v => v.name === colorName);
    const colorImage = colorValue?.image;
    
    const cartImage = variantFeaturedImage || colorImage || primaryImage;

    cart.add(product, colorName, cartImage, sizeName, 1, { openDrawer: false, unitPrice: currentPrice });
    toast.success(`${product.name} added to your cart.`);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
        <div className="grid gap-5 sm:grid-cols-[200px_1fr] sm:items-start">
          <div className="relative overflow-hidden rounded-lg border border-border/80 bg-muted/20">
            <Image
              key={primaryImage} // Force re-render when image changes
              src={primaryImage}
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
              {productData?.description && (
                <DialogDescription className="mt-0.5 text-xs text-muted-foreground">
                  {productData.description}
                </DialogDescription>
              )}
              <div className="mt-1.5 flex items-center gap-2">
                <p className="font-serif text-lg font-medium text-foreground">
                  {formatPrice(currentPrice)}
                </p>
                {isSpecialEdition && (
                  <Badge variant="secondary" className="text-[10px] tracking-wider uppercase">
                    Special Edition
                  </Badge>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-sm text-muted-foreground">Loading variants...</div>
            ) : (
              variantAttributes.map((attribute) => {
                const selectedValue = selections[attribute.name];
                const availableValues = getAvailableValues(
                  productData.product_varient_values,
                  attribute.name,
                  selections
                );

                return (
                  <div key={attribute.name}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      {attribute.name}
                      {selectedValue && (
                        <span className="font-normal normal-case text-muted-foreground tracking-normal">
                          {" "}
                          &mdash; {selectedValue}
                        </span>
                      )}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {attribute.values.map((value) => {
                        const isAvailable = availableValues.includes(value.name);
                        const isSelected = selectedValue === value.name;

                        return (
                          <button
                            key={value.name}
                            type="button"
                            onClick={() => handleAttributeChange(attribute.name, value.name)}
                            disabled={!isAvailable}
                            aria-pressed={isSelected}
                            aria-label={`${attribute.name}: ${value.name}`}
                            className={cn(
                              "overflow-hidden rounded-lg border transition-all",
                              isSelected
                                ? "border-terracotta ring-2 ring-terracotta/80 shadow-xs"
                                : "border-border/80 hover:border-foreground/40",
                              !isAvailable && "opacity-40 cursor-not-allowed",
                              value.image ? "bg-[#faf7f2] p-1" : "bg-background px-3 py-2"
                            )}
                          >
                            {value.image ? (
                              <img
                                src={value.image}
                                alt={value.name}
                                className="h-12 w-12 rounded-md object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-xs font-medium">{value.name}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}

            <div className="flex flex-col gap-2 pt-2 border-t border-border/70">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-sm font-medium"
                onClick={handleAddToCart}
                disabled={loading || variantAttributes.length === 0}
              >
                {loading ? "Loading..." : `Add to cart — ${formatPrice(currentPrice)}`}
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
