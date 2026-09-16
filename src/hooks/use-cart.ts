"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Product } from "@/types/product";

export interface CartLine {
  /** Stable line id: product, colour and size combined. */
  id: string;
  productSlug: string;
  name: string;
  url: string;
  image: string;
  colorName: string;
  size: number;
  quantity: number;
  unitPrice: number;
}

export interface CartState {
  lines: CartLine[];
  isOpen: boolean;
}

const STORAGE_KEY = "nyanopan-cart-v1";
const EMPTY_STATE: CartState = { lines: [], isOpen: false };

let state: CartState = { ...EMPTY_STATE, lines: [] };
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
  } catch {
    /* Storage unavailable */
  }
}

function setState(partial: Partial<CartState>) {
  state = { ...state, ...partial };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CartState {
  return state;
}

/** Restore persisted lines after client render so cart items persist indefinitely */
function hydrate() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as CartLine[];
    if (Array.isArray(parsed)) {
      state = { ...state, lines: parsed };
      listeners.forEach((l) => l());
    }
  } catch {
    /* Corrupted or unavailable */
  }
}

function lineId(productSlug: string, colorName: string, size: number): string {
  return `${productSlug}::${colorName.toLowerCase()}::${size}`;
}

export const cart = {
  subscribe,
  getSnapshot,
  hydrate,

  add(
    product: Product,
    colorName: string,
    colorImage: string,
    size: number,
    quantity = 1,
    opts: { openDrawer?: boolean } = {}
  ) {
    const id = lineId(product.slug, colorName, size);
    const existing = state.lines.find((l) => l.id === id);
    const nextLines = existing
      ? state.lines.map((l) => (l.id === id ? { ...l, quantity: l.quantity + quantity } : l))
      : [
          ...state.lines,
          {
            id,
            productSlug: product.slug,
            name: product.name,
            url: `/products/${product.slug}`,
            image: colorImage,
            colorName,
            size,
            quantity,
            unitPrice: product.price,
          },
        ];
    setState({ lines: nextLines, isOpen: opts.openDrawer ?? true });
  },

  remove(id: string) {
    setState({ lines: state.lines.filter((l) => l.id !== id) });
  },

  setQuantity(id: string, quantity: number) {
    if (quantity < 1) {
      cart.remove(id);
      return;
    }
    setState({
      lines: state.lines.map((l) => (l.id === id ? { ...l, quantity } : l)),
    });
  },

  clear() {
    setState({ lines: [] });
  },

  open() {
    setState({ isOpen: true });
  },

  close() {
    setState({ isOpen: false });
  },
};

export function useCart(): CartState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useCartLine(id: string): CartLine | undefined {
  const select = useCallback(
    () => state.lines.find((l) => l.id === id),
    [id]
  );
  return useSyncExternalStore(subscribe, select, select);
}

export function useCartCount(): number {
  const select = useCallback(
    () => state.lines.reduce((sum, l) => sum + l.quantity, 0),
    []
  );
  return useSyncExternalStore(subscribe, select, select);
}

export function useCartSubtotal(): number {
  const select = useCallback(
    () => state.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    []
  );
  return useSyncExternalStore(subscribe, select, select);
}
