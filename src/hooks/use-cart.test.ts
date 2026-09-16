import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { cart, useCart, useCartCount, useCartSubtotal } from "@/hooks/use-cart";
import type { Product } from "@/types/product";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    slug: "mula-grey",
    name: "Mula Wool Felt Slippers Grey",
    price: 49.95,
    ...overrides,
  } as Product;
}

const STORAGE_KEY = "nyanopan-cart-v1";

beforeEach(() => {
  window.localStorage.clear();
  cart.clear();
  cart.close();
});

describe("cart store", () => {
  it("starts empty and closed", () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.lines).toEqual([]);
    expect(result.current.isOpen).toBe(false);
  });

  it("adds a line and opens the drawer", () => {
    const { result } = renderHook(() => useCart());
    act(() => cart.add(makeProduct(), "Grey", "grey.jpg", 42));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0]).toMatchObject({
      productSlug: "mula-grey",
      colorName: "Grey",
      size: 42,
      quantity: 1,
      unitPrice: 49.95,
    });
  });

  it("merges identical product, colour and size into one line", () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      cart.add(makeProduct(), "Grey", "grey.jpg", 42);
      cart.add(makeProduct(), "Grey", "grey.jpg", 42);
    });
    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0].quantity).toBe(2);
  });

  it("can add without opening the drawer", () => {
    const { result } = renderHook(() => useCart());
    act(() => cart.add(makeProduct(), "Grey", "grey.jpg", 42, 1, { openDrawer: false }));
    expect(result.current.isOpen).toBe(false);
    expect(result.current.lines).toHaveLength(1);
  });

  it("keeps different colours and sizes on separate lines", () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      cart.add(makeProduct(), "Grey", "grey.jpg", 42);
      cart.add(makeProduct(), "Grey", "grey.jpg", 43);
      cart.add(makeProduct(), "Blue", "blue.jpg", 42);
    });
    expect(result.current.lines).toHaveLength(3);
  });

  it("removes a line when the quantity drops below one", () => {
    const { result } = renderHook(() => useCart());
    act(() => cart.add(makeProduct(), "Grey", "grey.jpg", 42));
    const id = result.current.lines[0].id;
    act(() => cart.setQuantity(id, 0));
    expect(result.current.lines).toEqual([]);
  });

  it("updates a quantity explicitly", () => {
    const { result } = renderHook(() => useCart());
    act(() => cart.add(makeProduct(), "Grey", "grey.jpg", 42));
    const id = result.current.lines[0].id;
    act(() => cart.setQuantity(id, 4));
    expect(result.current.lines[0].quantity).toBe(4);
  });

  it("computes the subtotal from unit prices and quantities", () => {
    const { result } = renderHook(() => useCartSubtotal());
    expect(result.current).toBe(0);
    act(() => {
      cart.add(makeProduct(), "Grey", "grey.jpg", 42);
      cart.add(makeProduct({ slug: "slipa", price: 44.95 }), "Natural", "natural.jpg", 41);
    });
    expect(result.current).toBe(94.9);
  });

  it("counts the total number of items", () => {
    const { result } = renderHook(() => useCartCount());
    act(() => {
      cart.add(makeProduct(), "Grey", "grey.jpg", 42);
      cart.add(makeProduct(), "Grey", "grey.jpg", 42);
      cart.add(makeProduct({ slug: "slipa", price: 44.95 }), "Natural", "natural.jpg", 41);
    });
    expect(result.current).toBe(3);
  });

  it("clears all lines", () => {
    act(() => cart.add(makeProduct(), "Grey", "grey.jpg", 42));
    expect(cart.getSnapshot().lines).toHaveLength(1);
    act(() => cart.clear());
    expect(cart.getSnapshot().lines).toHaveLength(0);
  });

  it("persists lines to localStorage for long-term storage", () => {
    act(() => cart.add(makeProduct(), "Grey", "grey.jpg", 42));
    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].size).toBe(42);
  });

  it("restores persisted lines on hydrate", () => {
    act(() => cart.add(makeProduct(), "Grey", "grey.jpg", 42));
    const saved = window.localStorage.getItem(STORAGE_KEY) as string;
    act(() => cart.clear());
    const { result } = renderHook(() => useCart());
    expect(result.current.lines).toEqual([]);
    /* Simulate a page revisit: storage survives, memory does not */
    window.localStorage.setItem(STORAGE_KEY, saved);
    act(() => cart.hydrate());
    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0].colorName).toBe("Grey");
  });
});
