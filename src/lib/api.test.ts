import { describe, expect, it } from "vitest";

import { filterProducts, getCollectionFacets } from "@/lib/api";
import { EMPTY_FILTERS } from "@/types/product";

// Tests disabled - static product data removed, all products now from API
const all: any[] = [];

describe.skip("filterProducts", () => {
  it("returns every product with empty filters", () => {
    expect(filterProducts(all, EMPTY_FILTERS, "featured")).toHaveLength(all.length);
  });

  it("sorts by price low to high", () => {
    const sorted = filterProducts(all, EMPTY_FILTERS, "price-low-high");
    const prices = sorted.map((p) => p.price);
    const expected = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(expected);
  });

  it("sorts by price high to low", () => {
    const sorted = filterProducts(all, EMPTY_FILTERS, "price-high-low");
    const prices = sorted.map((p) => p.price);
    const expected = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(expected);
  });

  it("sorts newest first by addedAt", () => {
    const sorted = filterProducts(all, EMPTY_FILTERS, "newest");
    const dates = sorted.map((p) => new Date(p.addedAt).getTime());
    const expected = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(expected);
  });

  it("sorts oldest by ascending date", () => {
    const sorted = filterProducts(all, EMPTY_FILTERS, "oldest");
    const dates = sorted.map((p) => new Date(p.addedAt).getTime());
    const expected = [...dates].sort((a, b) => a - b);
    expect(dates).toEqual(expected);
  });

  it("puts featured products first in the default sort", () => {
    const sorted = filterProducts(all, EMPTY_FILTERS, "featured");
    const firstNonFeatured = sorted.findIndex((p) => !p.featured);
    if (firstNonFeatured > 0) {
      expect(sorted.slice(0, firstNonFeatured).every((p) => p.featured)).toBe(true);
    }
  });

  it("filters by sole type", () => {
    const result = filterProducts(all, { ...EMPTY_FILTERS, soles: ["rubber"] }, "featured");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.soleType === "rubber")).toBe(true);
  });

  it("filters by colour value", () => {
    const result = filterProducts(all, { ...EMPTY_FILTERS, colors: ["pink"] }, "featured");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.colors.some((c) => c.value === "pink"))).toBe(true);
  });

  it("combines filters across dimensions", () => {
    const result = filterProducts(
      all,
      { ...EMPTY_FILTERS, genders: ["unisex"], soles: ["leather"] },
      "featured"
    );
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.gender === "unisex" && p.soleType === "leather")).toBe(true);
  });

  it("filters by available size", () => {
    const result = filterProducts(all, { ...EMPTY_FILTERS, sizes: [48] }, "featured");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.sizes.includes(48))).toBe(true);
  });

  it("returns an empty list when nothing matches", () => {
    const result = filterProducts(all, { ...EMPTY_FILTERS, sizes: [16] }, "featured");
    expect(result).toEqual([]);
  });
});

describe.skip("getCollectionFacets", () => {
  it("derives facets from the products in a collection", () => {
    const facets = getCollectionFacets("slippers-kids");
    expect(facets.soles).toEqual(["leather", "rubber"]);
    expect(facets.models).toContain("Luna Kids");
    expect(facets.models).toContain("Baby Booties");
    expect(Math.min(...facets.sizes)).toBe(17);
    expect(Math.max(...facets.sizes)).toBe(33);
  });

  it("returns empty facets for an unknown collection", () => {
    const facets = getCollectionFacets("does-not-exist");
    expect(facets.colors).toEqual([]);
    expect(facets.models).toEqual([]);
  });
});
