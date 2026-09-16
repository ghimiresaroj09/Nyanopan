import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { recentlyViewed, useRecentlyViewedSlugs } from "@/hooks/use-recently-viewed";

beforeEach(() => {
  recentlyViewed.clear();
});

describe("recentlyViewed store", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useRecentlyViewedSlugs());
    expect(result.current).toEqual([]);
  });

  it("records the most recent slug first", () => {
    act(() => {
      recentlyViewed.record("product-a");
      recentlyViewed.record("product-b");
    });
    const { result } = renderHook(() => useRecentlyViewedSlugs());
    expect(result.current).toEqual(["product-b", "product-a"]);
  });

  it("moves a repeated slug to the front instead of duplicating it", () => {
    act(() => {
      recentlyViewed.record("product-a");
      recentlyViewed.record("product-b");
      recentlyViewed.record("product-a");
    });
    const { result } = renderHook(() => useRecentlyViewedSlugs());
    expect(result.current).toEqual(["product-a", "product-b"]);
  });

  it("keeps at most eight items", () => {
    act(() => {
      for (let i = 0; i < 12; i += 1) {
        recentlyViewed.record(`slug-${i}`);
      }
    });
    const { result } = renderHook(() => useRecentlyViewedSlugs());
    expect(result.current).toHaveLength(8);
    expect(result.current[0]).toBe("slug-11");
  });

  it("clears all records", () => {
    act(() => recentlyViewed.record("product-a"));
    expect(recentlyViewed.getSnapshot()).toHaveLength(1);
    act(() => recentlyViewed.clear());
    expect(recentlyViewed.getSnapshot()).toHaveLength(0);
  });
});
