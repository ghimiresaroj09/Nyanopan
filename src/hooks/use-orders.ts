"use client";

import { useSyncExternalStore } from "react";

import {
  getOrdersServerSnapshot,
  getOrdersSnapshot,
  subscribeOrders,
} from "@/lib/orders";

/** All locally stored orders (newest first). */
export function useOrders() {
  return useSyncExternalStore(subscribeOrders, getOrdersSnapshot, getOrdersServerSnapshot);
}
