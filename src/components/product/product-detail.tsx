"use client";

import { useState } from "react";
import { ProductGallery } from "./product-gallery";
import { ProductBuyBox } from "./product-buy-box";
import type { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product;
  productData: any;
}

export function ProductDetail({ product, productData }: ProductDetailProps) {
  const [isSpecialEdition, setIsSpecialEdition] = useState(false);
  const [variantImage, setVariantImage] = useState<string | null>(null);
  const optionImages = (productData?.attributes ?? []).flatMap((attribute: any) =>
    (attribute.attributeValues ?? []).flatMap((value: any) => [
      value.featureImage?.url,
      ...(value.additionalImages ?? []).map((image: any) => image.url),
    ])
  );
  const variantImages = (productData?.product_varient_values ?? []).flatMap((variant: any) => [
    variant.featured_image?.url,
    variant.feature_image?.url,
    ...(variant.images ?? []).map((image: any) => image.url ?? image),
    ...(variant.attributes ?? []).flatMap((attribute: any) =>
      (attribute.attributeValues ?? []).flatMap((value: any) => [
        value.featureImage?.url,
        ...(value.additionalImages ?? []).map((image: any) => image.url),
      ])
    ),
  ]);
  const currentImages = Array.from(new Set([
    productData?.feature_image?.url,
    ...(productData?.product_images ?? []).map((image: any) => image.url),
    ...optionImages,
    ...variantImages,
    ...product.images,
  ].filter((image): image is string => typeof image === "string" && image.length > 0)));
  
  // Use dynamic special edition state from variant selection
  const badge = isSpecialEdition ? "Special edition" : product.badge;
  
  return (
    <>
      <div className="space-y-6">
        <ProductGallery 
          images={currentImages} 
          alt={product.name} 
          badge={badge}
          featuredImage={variantImage}
        />
        
        {/* General Information below gallery */}
        {productData?.general_information && (
          <div className="rounded-lg border border-border/70 bg-[#fbf8f2] p-4.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-terracotta mb-3">General Information</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{productData.general_information}</p>
          </div>
        )}
      </div>
      
      <ProductBuyBox 
        product={product} 
        productData={productData}
        onSpecialEditionChange={setIsSpecialEdition}
        onVariantImageChange={setVariantImage}
      />
    </>
  );
}
