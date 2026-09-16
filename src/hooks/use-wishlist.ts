"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Wishlist. Kept in reactive application state.
 */

const EMPTY: string[] = [];

let slugs: string[] = [];
const listeners = new Set<() => void>();

function setSlugs(next: string[]) {
  slugs = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const wishlist = {
  subscribe,
  getSnapshot: () => slugs,
  getServerSnapshot: () => EMPTY,

  has(slug: string): boolean {
    return slugs.includes(slug);
  },

  /** Returns true when the product was added. */
  toggle(slug: string): boolean {
    if (slugs.includes(slug)) {
      setSlugs(slugs.filter((s) => s !== slug));
      return false;
    }
    setSlugs([...slugs, slug]);
    return true;
  },

  remove(slug: string) {
    if (slugs.includes(slug)) {
      setSlugs(slugs.filter((s) => s !== slug));
    }
  },

  clear() {
    setSlugs([]);
  },

  hydrate() {
    listeners.forEach((listener) => listener());
  },
};

export function useWishlistSlugs(): string[] {
  return useSyncExternalStore(
    wishlist.subscribe,
    wishlist.getSnapshot,
    wishlist.getServerSnapshot
  );
}

export function useWishlistHas(slug: string): boolean {
  const select = useCallback(() => wishlist.has(slug), [slug]);
  return useSyncExternalStore(wishlist.subscribe, select, () => false);
}
