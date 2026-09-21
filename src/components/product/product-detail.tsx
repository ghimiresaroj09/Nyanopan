"use client";

import { useState, useEffect } from "react";
import { ProductGallery } from "./product-gallery";
import { ProductBuyBox } from "./product-buy-box";
import type { Product } from "@/types/product";

interface ProductDetailProps {
  product: Product;
  productData: any;
}

// Helper function to get images for a selected color from API data
function getImagesForColor(productData: any, colorName: string, fallbackImages: string[]): string[] {
  const images: string[] = [];
  
  // Find the color attribute
  const colorAttr = productData.attributes?.find((attr: any) => attr.attribute.name === "Color");
  
  if (colorAttr) {
    const colorValue = colorAttr.attributeValues?.find((val: any) => val.name === colorName);
    
    if (colorValue) {
      // Add feature image if exists
      if (colorValue.featureImage?.url) {
        images.push(colorValue.featureImage.url);
      }
      
      // Add additional images if exist
      if (colorValue.additionalImages && colorValue.additionalImages.length > 0) {
        colorValue.additionalImages.forEach((img: any) => {
          if (img.url && !images.includes(img.url)) {
            images.push(img.url);
          }
        });
      }
    }
  }
  
  // If no color-specific images found, use fallback (product images)
  if (images.length === 0) {
    return fallbackImages;
  }
  
  return images;
}

export function ProductDetail({ product, productData }: ProductDetailProps) {
  const [colorIndex, setColorIndex] = useState(0);
  const [isSpecialEdition, setIsSpecialEdition] = useState(false);
  const color = product.colors[colorIndex];
  
  // Get images for the selected color
  const currentImages = getImagesForColor(productData, color.name, product.images);
  
  // Use dynamic special edition state from variant selection
  const badge = isSpecialEdition ? "Special edition" : product.badge;
  
  return (
    <>
      <div className="space-y-6">
        <ProductGallery 
          images={currentImages} 
          alt={product.name} 
          badge={badge}
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
        colorIndex={colorIndex}
        onColorChange={setColorIndex}
        onSpecialEditionChange={setIsSpecialEdition}
      />
    </>
  );
}
