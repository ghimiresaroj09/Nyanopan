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
function extractVariantAttributes(variants: any[], productAttributes: any[] = []): VariantAttribute[] {
  const attributeMap = new Map<string, Set<string>>();
  const attributeImages = new Map<string, Map<string, string>>();

  const addAttribute = (attr: any) => {
    const attrName = attr.attribute?.name;
    if (!attrName) return;

    if (!attributeMap.has(attrName)) {
      attributeMap.set(attrName, new Set());
      attributeImages.set(attrName, new Map());
    }

    (attr.attributeValues ?? []).forEach((val: any) => {
      if (!val.name) return;
      attributeMap.get(attrName)!.add(val.name);

      // Store the featured image if available.
      const image = val.featureImage?.url ?? val.featured_image?.url ?? val.featured_image ?? val.image?.url ?? val.image;
      if (typeof image === "string" && image) {
        attributeImages.get(attrName)!.set(val.name, image);
      } else if (val.additionalImages?.[0]?.url && !attributeImages.get(attrName)!.has(val.name)) {
        attributeImages.get(attrName)!.set(val.name, val.additionalImages[0].url);
      }
    });
  };

  variants.forEach((variant) => {
    (variant.attributes ?? []).forEach(addAttribute);
  });
  productAttributes.forEach(addAttribute);

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
  priorSelections: Record<string, string>,
): string[] {
  const available = new Set<string>();

  variants.forEach((variant) => {
    const variantAttributes = variant.attributes ?? [];
    const hasAttributeValue = variantAttributes.some((attribute: any) =>
      attribute.attribute.name === attributeName
    );
    if (!hasAttributeValue) return;

    const matchesPriorSelections = Object.entries(priorSelections).every(([selectedName, selectedValue]) => {
      const selectedAttribute = variantAttributes.find((attribute: any) =>
        attribute.attribute.name === selectedName
      );
      return !selectedAttribute || selectedAttribute.attributeValues.some((option: any) => option.name === selectedValue);
    });
    if (!matchesPriorSelections) return;

    (variant.attributes ?? []).forEach((attr: any) => {
      if (attr.attribute.name === attributeName) {
        attr.attributeValues.forEach((val: any) => {
          available.add(val.name);
        });
      }
    });
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
  const variants = (productData?.product_varient_values ?? []).filter(
    (variant: any) => variant.isActive !== false
  );

  // Fetch product data when dialog opens
  useEffect(() => {
    if (open) {
      setLoading(true);
      setProductData(null);
      setSelections({});
      
      getProduct(product.slug).then((data) => {
        if (!data) {
          setProductData(null);
          setVariantAttributes([]);
          return;
        }
        
        setProductData(data);
        
        // Extract variant attributes from API
        const activeVariants = (data.product_varient_values ?? []).filter(
          (variant: any) => variant.isActive !== false
        );
        if (activeVariants.length > 0) {
          const attributes = extractVariantAttributes(activeVariants, data.attributes ?? []);
          setVariantAttributes(attributes);
          
          // Let shoppers choose each attribute explicitly in the dialog.
          setSelections({});
        } else {
          setVariantAttributes([]);
          setSelections({});
        }
      }).catch(() => {
        setProductData(null);
        setVariantAttributes([]);
        setSelections({});
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [open, product.slug, product.price]);

  // Find current variant based on selections
  const currentVariant = variants.find((v: any) => {
    const selectedEntries = Object.entries(selections);
    return selectedEntries.length === variantAttributes.length && selectedEntries.every(([attrName, selectedValue]) => {
      return (v.attributes ?? []).some((attr: any) =>
        attr.attribute.name === attrName &&
        attr.attributeValues.some((val: any) => val.name === selectedValue)
      );
    });
  });

  const currentPrice = currentVariant ? parseFloat(currentVariant.price) : product.price;
  const isSpecialEdition = currentVariant?.isSpecialEdition === true;

  // Prefer the selected variant image, then its selected option image, then the product feature image.
  const variantImageValue = currentVariant?.featured_image ?? currentVariant?.feature_image ?? currentVariant?.featureImage ?? currentVariant?.image;
  const variantImage = typeof variantImageValue === "string" ? variantImageValue : variantImageValue?.url;
  const selectedOptionImage = variantAttributes
    .map((attribute) => attribute.values.find((value) => value.name === selections[attribute.name])?.image)
    .find(Boolean);
  const primaryImage = variantImage || selectedOptionImage ||
    productData?.feature_image?.url ||
    product.images?.[0] ||
    '';

  function handleAttributeChange(attributeName: string, value: string) {
    setSelections((previous) => {
      const next = { ...previous, [attributeName]: value };
      const changedIndex = variantAttributes.findIndex((attribute) => attribute.name === attributeName);
      const compatibleVariant = variants.find((variant: any) =>
        (variant.attributes ?? []).some((attribute: any) =>
          attribute.attribute.name === attributeName &&
          attribute.attributeValues.some((option: any) => option.name === value)
        ) && variantAttributes.slice(0, changedIndex + 1).every((selectedAttribute) => {
          const selectedValue = next[selectedAttribute.name];
          return !selectedValue || (variant.attributes ?? []).some((attribute: any) =>
            attribute.attribute.name === selectedAttribute.name &&
            attribute.attributeValues.some((option: any) => option.name === selectedValue)
          );
        })
      );
      if (compatibleVariant) {
        variantAttributes.slice(changedIndex + 1).forEach((laterAttribute) => {
          const selectedValue = next[laterAttribute.name];
          if (selectedValue && !(compatibleVariant.attributes ?? []).some((attribute: any) =>
            attribute.attribute.name === laterAttribute.name &&
            attribute.attributeValues.some((option: any) => option.name === selectedValue)
          )) delete next[laterAttribute.name];
        });
      }
      return next;
    });
  }

  function handleAddToCart() {
    const requiredAttributes = variantAttributes.map((attribute) => attribute.name);
    if (requiredAttributes.some((name) => !selections[name])) {
      toast.error("Please select all options.");
      return;
    }

    if (productData?.product_varient_values?.length && !currentVariant) {
      toast.error("That combination is unavailable. Please choose another option.");
      return;
    }

    // Prefer the selected variant image, then a selected option image, then the product feature image.
    const variantFeaturedValue = currentVariant?.featured_image ?? currentVariant?.feature_image ?? currentVariant?.featureImage ?? currentVariant?.image;
    const variantFeaturedImage = typeof variantFeaturedValue === "string" ? variantFeaturedValue : variantFeaturedValue?.url;
    const selectedOptionImage = variantAttributes
      .map((attribute) => attribute.values.find((value) => value.name === selections[attribute.name])?.image)
      .find(Boolean);
    const cartImage = variantFeaturedImage || selectedOptionImage || productData?.feature_image?.url || primaryImage;
    const selectionLines = variantAttributes.map((attribute) => `${attribute.name}: ${selections[attribute.name]}`);
    const colorName = selections.Color || selections.Colour || selectionLines.join(", ") || "Default";
    const sizeName = selections.Size || selections["Shoes Size"] || currentVariant?.name || "Default";

    cart.add(product, colorName, cartImage, sizeName, 1, {
      openDrawer: false,
      unitPrice: currentPrice,
      optionSelections: selectionLines,
      variantId: currentVariant?.id,
    });
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
              variantAttributes.map((attribute, attributeIndex) => {
                const selectedValue = selections[attribute.name];
                const priorSelections = Object.fromEntries(
                  variantAttributes
                    .slice(0, attributeIndex)
                    .filter((priorAttribute) => selections[priorAttribute.name])
                    .map((priorAttribute) => [priorAttribute.name, selections[priorAttribute.name]])
                );
                const availableValues = getAvailableValues(
                  variants,
                  attribute.name,
                  priorSelections
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
                      {attribute.values.filter((value) => availableValues.includes(value.name)).map((value) => {
                        const isSelected = selectedValue === value.name;

                        return (
                          <button
                            key={value.name}
                            type="button"
                            onClick={() => handleAttributeChange(attribute.name, value.name)}
                            aria-pressed={isSelected}
                            aria-label={`${attribute.name}: ${value.name}`}
                            className={cn(
                              "overflow-hidden rounded-lg border transition-all",
                              isSelected
                                ? "border-terracotta ring-2 ring-terracotta/80 shadow-xs"
                                : "border-border/80 hover:border-foreground/40",
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
