import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useWishlistHas, useWishlistSlugs, wishlist } from "@/hooks/use-wishlist";

beforeEach(() => {
  wishlist.clear();
});

describe("wishlist store", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useWishlistSlugs());
    expect(result.current).toEqual([]);
  });

  it("toggles a product in and out", () => {
    const { result } = renderHook(() => useWishlistSlugs());
    act(() => wishlist.toggle("product-a"));
    expect(result.current).toEqual(["product-a"]);
    act(() => wishlist.toggle("product-a"));
    expect(result.current).toEqual([]);
  });

  it("reports whether a product is wishlisted", () => {
    const { result } = renderHook(() => useWishlistHas("product-a"));
    expect(result.current).toBe(false);
    act(() => wishlist.toggle("product-a"));
    expect(result.current).toBe(true);
  });

  it("never stores duplicates", () => {
    act(() => {
      wishlist.toggle("product-a");
      wishlist.toggle("product-b");
      wishlist.toggle("product-a");
    });
    const { result } = renderHook(() => useWishlistSlugs());
    expect(result.current).toEqual(["product-b"]);
  });

  it("removes a specific slug", () => {
    act(() => {
      wishlist.toggle("product-a");
      wishlist.toggle("product-b");
      wishlist.remove("product-a");
    });
    expect(wishlist.has("product-a")).toBe(false);
    expect(wishlist.has("product-b")).toBe(true);
  });
});
