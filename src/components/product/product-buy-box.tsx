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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductBuyBoxProps {
  product: Product;
  productData?: any; // Optional API product data with variants
  onSpecialEditionChange?: (isSpecial: boolean) => void; // Special edition state callback
  onVariantImageChange?: (image: string | null) => void;
}

interface ProductOptionGroup {
  id: string;
  name: string;
  values: string[];
  images: Record<string, string>;
}

function getVariantAttributes(variant: any): Array<{ id: string; name: string; values: string[]; images: Record<string, string> }> {
  return (variant?.attributes ?? []).flatMap((attribute: any) => {
    const name = attribute.attribute?.name;
    if (!name) return [];
    const attributeValues = attribute.attributeValues ?? [];
    const values = attributeValues.map((value: any) => value.name).filter(Boolean);
    const images = Object.fromEntries(attributeValues.flatMap((value: any) => {
      const image = value.featureImage?.url ?? value.featuredImage?.url ?? value.image?.url ?? value.image;
      return value.name && typeof image === "string" && image ? [[value.name, image]] : [];
    }));
    return values.length ? [{ id: attribute.attribute.id ?? name, name, values, images }] : [];
  });
}

function getVariantImage(variant: any): string | undefined {
  const image = variant?.featured_image ?? variant?.feature_image ?? variant?.featureImage ?? variant?.image;
  const imageUrl = typeof image === "string" ? image : image?.url;
  if (imageUrl) return imageUrl;
  return variant?.images?.find((item: any) => typeof item?.url === "string")?.url;
}

export function ProductBuyBox({ product, productData, onSpecialEditionChange, onVariantImageChange }: ProductBuyBoxProps) {
  const variants = (productData?.product_varient_values ?? []).filter((variant: any) => variant.isActive !== false);
  const optionGroups: ProductOptionGroup[] = [];
  const groupMap = new Map<string, ProductOptionGroup>();

  variants.forEach((variant: any) => {
    getVariantAttributes(variant).forEach(({ id, name, values, images }) => {
      const group = groupMap.get(id) ?? { id, name, values: [], images: {} };
      values.forEach((value) => {
        if (!group.values.includes(value)) group.values.push(value);
      });
      Object.assign(group.images, images);
      groupMap.set(id, group);
    });
  });
  (productData?.attributes ?? []).forEach((attribute: any) => {
    const id = attribute.attribute?.id ?? attribute.attribute?.name;
    const group = id ? groupMap.get(id) : undefined;
    if (!group) return;
    (attribute.attributeValues ?? []).forEach((value: any) => {
      const image = value.featureImage?.url ?? value.featuredImage?.url ?? value.image?.url ?? value.image;
      if (value.name && typeof image === "string" && image && !group.images[value.name]) {
        group.images[value.name] = image;
      }
    });
  });
  optionGroups.push(...groupMap.values());

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const wishlisted = useWishlistHas(product.slug);

  const matchingVariants = variants.filter((variant: any) =>
    getVariantAttributes(variant).every(({ id, name, values }) => {
      const groupId = optionGroups.find((group) => group.id === id || group.name === name)?.id;
      const selected = groupId ? selectedOptions[groupId] : undefined;
      return !selected || values.includes(selected);
    })
  );
  const selectedVariant = matchingVariants.find((variant: any) =>
    optionGroups.every((group) => {
      const selected = selectedOptions[group.id];
      if (!selected) return true;
      const variantAttribute = getVariantAttributes(variant).find((attribute) => attribute.id === group.id);
      return variantAttribute?.values.includes(selected) ?? false;
    })
  );

  let currentPrice = product.price;
  if (selectedVariant) currentPrice = parseFloat(selectedVariant.price);
  const isSpecialEdition = selectedVariant?.isSpecialEdition === true;

  // Notify parent component when special edition status changes
  useEffect(() => {
    if (onSpecialEditionChange) {
      onSpecialEditionChange(isSpecialEdition);
    }
  }, [isSpecialEdition, onSpecialEditionChange]);

  function handleAddToCart() {
    if (optionGroups.some((group) => !selectedOptions[group.id])) {
      toast.error("Please select all product options first.");
      return;
    }

    if (variants.length > 0 && !selectedVariant) {
      toast.error("That combination is unavailable. Please choose another option.");
      return;
    }

    const selections = optionGroups.map((group) => `${group.name}: ${selectedOptions[group.id]}`);
    const color = optionGroups.find((group) => group.name.toLowerCase() === "color");
    const size = optionGroups.find((group) => /size/i.test(group.name));
    const cartColor = color ? selectedOptions[color.id] : selections.join(", ") || "Default";
    const cartSize = size ? selectedOptions[size.id] : selectedVariant?.name ?? "Default";
    const selectedOptionImage = optionGroups
      .map((group) => group.images[selectedOptions[group.id]])
      .find(Boolean);
    const cartImage = getVariantImage(selectedVariant) ?? selectedOptionImage ?? productData?.feature_image?.url ?? product.images[0] ?? "";

    cart.add(product, cartColor, cartImage, cartSize, 1, {
      unitPrice: currentPrice,
      optionSelections: selections,
      variantId: selectedVariant?.id,
    });
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

      {optionGroups.map((group) => {
        const availableValues = group.values.filter((value) =>
          variants.some((variant: any) =>
            getVariantAttributes(variant).some((attribute) => {
              if (attribute.id !== group.id || !attribute.values.includes(value)) return false;
              return getVariantAttributes(variant).every((variantOption) => {
                if (variantOption.id === group.id) return true;
                const selected = selectedOptions[variantOption.id];
                return !selected || variantOption.values.includes(selected);
              });
            })
          )
        );
        return <div key={group.id}>
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider font-semibold text-foreground">
              {group.name}{selectedOptions[group.id] ? <span className="font-normal text-muted-foreground normal-case tracking-normal">&mdash; {selectedOptions[group.id]}</span> : null}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5">
          {availableValues.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                const next = { ...selectedOptions, [group.id]: value };
                Object.entries(next).forEach(([selectedGroupId, selectedValue]) => {
                  if (selectedGroupId === group.id) return;
                  const compatible = variants.some((variant: any) =>
                    Object.entries(next).every(([optionId, selected]) =>
                      getVariantAttributes(variant).some((attribute) =>
                        attribute.id === optionId && attribute.values.includes(selected)
                      )
                    ) && next[selectedGroupId] === selectedValue
                  );
                  if (!compatible) delete next[selectedGroupId];
                });

                const imageVariant = variants.find((variant: any) =>
                  getVariantAttributes(variant).every((attribute) => {
                    const selected = next[attribute.id];
                    return !selected || attribute.values.includes(selected);
                  }) && Object.entries(next).every(([optionId, selected]) =>
                    getVariantAttributes(variant).some((attribute) =>
                      attribute.id === optionId && attribute.values.includes(selected)
                    )
                  )
                );
                onVariantImageChange?.(
                  getVariantImage(imageVariant) ??
                  group.images[value] ??
                  productData?.feature_image?.url ??
                  product.images[0] ??
                  null
                );
                setSelectedOptions(next);
              }}
              aria-pressed={selectedOptions[group.id] === value}
              aria-label={`${group.name} ${value}`}
              className={cn(
                "overflow-hidden rounded-lg border transition-all duration-200",
                selectedOptions[group.id] === value
                  ? "border-terracotta ring-2 ring-terracotta/80 shadow-xs"
                  : "border-border/80 hover:border-foreground/40",
              group.images[value] ? "bg-[#faf7f2] p-1" : "bg-background px-3 py-2"
              )}
            >
              {group.images[value] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={group.images[value]}
                  alt={value}
                  title={value}
                  className="h-14 w-14 rounded-md object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-xs font-medium text-foreground">{value}</span>
              )}
            </button>
          ))}
          </div>
        </div>;
      })}

      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="text-xs font-medium text-terracotta underline underline-offset-4 hover:text-terracotta/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              Size guide
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md p-5 sm:p-6">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl font-normal">Size guide</DialogTitle>
              <DialogDescription>
                Use your foot length to find the closest fit. Measurements are approximate.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 overflow-hidden rounded-lg border border-border/70">
              <table className="w-full text-sm">
                <thead className="bg-[#fbf8f2] text-left text-xs uppercase tracking-wider text-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">EU size</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Foot length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {[
                    ["36", "22.5 cm"], ["37", "23 cm"], ["38", "24 cm"],
                    ["39", "24.5 cm"], ["40", "25 cm"], ["41", "26 cm"],
                    ["42", "26.5 cm"], ["43", "27.5 cm"], ["44", "28 cm"],
                    ["45", "29 cm"],
                  ].map(([eu, length]) => (
                    <tr key={eu} className="text-muted-foreground">
                      <th scope="row" className="px-4 py-2.5 text-left font-medium text-foreground">{eu}</th>
                      <td className="px-4 py-2.5">{length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Measure from the back of your heel to the tip of your longest toe while standing. If you are between sizes, choose the larger size.
            </p>
          </DialogContent>
        </Dialog>
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
