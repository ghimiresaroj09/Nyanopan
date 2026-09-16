import { describe, expect, it } from "vitest";

import { getShippingRate, qualifiesForFreeShipping } from "@/lib/shipping";

describe("getShippingRate", () => {
  it("returns null when no location is chosen", () => {
    expect(getShippingRate(undefined, 50)).toBeNull();
  });

  it("charges Rs. 100 for Kathmandu Valley", () => {
    expect(getShippingRate("Kathmandu Inside Ring Road", 50)).toBe(100);
    expect(getShippingRate("Lalitpur", 50)).toBe(100);
    expect(getShippingRate("Bhaktapur", 50)).toBe(100);
  });

  it("charges Rs. 150 for other districts in Nepal", () => {
    expect(getShippingRate("Pokhara", 50)).toBe(150);
    expect(getShippingRate("Chitwan", 50)).toBe(150);
    expect(getShippingRate("Jhapa", 50)).toBe(150);
  });

  it("gives free shipping above threshold", () => {
    expect(getShippingRate("Kathmandu Inside Ring Road", 150)).toBe(0);
    expect(getShippingRate("Pokhara", 200)).toBe(0);
  });
});

describe("qualifiesForFreeShipping", () => {
  it("is true at threshold", () => {
    expect(qualifiesForFreeShipping(150)).toBe(true);
    expect(qualifiesForFreeShipping(149.99)).toBe(false);
  });
});
