"use client";

import { useSyncExternalStore } from "react";

/**
 * Recently viewed products. Slug-only, capped at eight.
 * Kept in reactive application state.
 */

const MAX_ITEMS = 8;
const EMPTY: string[] = [];

let slugs: string[] = [];
const listeners = new Set<() => void>();

function setSlugs(next: string[]) {
  slugs = next;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const recentlyViewed = {
  subscribe,
  getSnapshot: () => slugs,
  getServerSnapshot: () => EMPTY,

  record(slug: string) {
    const next = [slug, ...slugs.filter((s) => s !== slug)].slice(0, MAX_ITEMS);
    if (next.join("\u0000") !== slugs.join("\u0000")) {
      setSlugs(next);
    }
  },

  clear() {
    setSlugs([]);
  },

  hydrate() {
    listeners.forEach((l) => l());
  },
};

export function useRecentlyViewedSlugs(): string[] {
  return useSyncExternalStore(
    recentlyViewed.subscribe,
    recentlyViewed.getSnapshot,
    recentlyViewed.getServerSnapshot
  );
}
