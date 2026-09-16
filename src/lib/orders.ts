import type { Order, OrderDraft } from "@/types/user";

/**
 * Order history. Orders placed at checkout are stored in
 * state, keyed by the user id that was signed in at the time
 * (or "guest"). This is the data the Order History page reads.
 */

const FIRST_ORDER_NUMBER = 100001;

let orders: Order[] = [];
let lastPlacedNumber: number | null = null;
const listeners = new Set<() => void>();

function commit() {
  listeners.forEach((listener) => listener());
}

export function subscribeOrders(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getOrdersSnapshot(): Order[] {
  return orders;
}

/** Stable server snapshot; must be a cached reference (useSyncExternalStore). */
const EMPTY_ORDERS: Order[] = [];

export function getOrdersServerSnapshot(): Order[] {
  return EMPTY_ORDERS;
}

export function hydrateOrders() {
  listeners.forEach((listener) => listener());
}

/** Test helper: returns the store to its initial state. */
export function resetOrders() {
  orders = [];
  lastPlacedNumber = null;
}

export function placeOrder(draft: OrderDraft): Order {
  const number = orders.length
    ? Math.max(...orders.map((o) => o.number)) + 1
    : FIRST_ORDER_NUMBER;
  const order: Order = {
    id: `NY-${String(number).padStart(6, "0")}`,
    number,
    placedAt: new Date().toISOString(),
    status: "Confirmed",
    ...draft,
  };
  orders = [order, ...orders];
  lastPlacedNumber = number;
  commit();
  return order;
}

export function listOrdersForUser(userId: string): Order[] {
  return orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
}

export function getLastPlacedNumber(): number | null {
  return lastPlacedNumber;
}
