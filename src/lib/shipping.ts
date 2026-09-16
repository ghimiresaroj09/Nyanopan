import { siteConfig } from "@/config/site";

/**
 * Shipping rates across Nepal.
 * Delivery inside Kathmandu valley: Rs. 100
 * Outside Kathmandu valley / All other districts: Rs. 150
 * Orders at or above the threshold qualify for complimentary shipping.
 */
export function getShippingRate(
  cityOrDistrict: string | undefined,
  subtotal: number
): number | null {
  if (!cityOrDistrict) return null;
  if (subtotal >= siteConfig.freeShippingThreshold) return 0;
  if (
    cityOrDistrict === "Kathmandu Inside Ring Road" ||
    cityOrDistrict === "Kathmandu Outside Ring Road" ||
    cityOrDistrict === "Lalitpur" ||
    cityOrDistrict === "Bhaktapur"
  ) {
    return 100;
  }
  return 150;
}

export function qualifiesForFreeShipping(subtotal: number): boolean {
  return subtotal >= siteConfig.freeShippingThreshold;
}
