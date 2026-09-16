import { beforeEach, describe, expect, it } from "vitest";

import {
  getLastPlacedNumber,
  getOrdersServerSnapshot,
  listOrdersForUser,
  placeOrder,
  resetOrders,
} from "@/lib/orders";
import type { OrderDraft } from "@/types/user";

function makeDraft(overrides: Partial<OrderDraft> = {}): OrderDraft {
  return {
    userId: "guest",
    email: "shyam@example.com",
    lines: [
      {
        slug: "mula-grey",
        name: "Mula Wool Felt Slippers Grey",
        colorName: "Grey",
        size: 42,
        quantity: 1,
        unitPrice: 49.95,
        image: "grey.jpg",
      },
    ],
    subtotal: 49.95,
    shipping: 100,
    total: 149.95,
    address: {
      fullName: "Shyam Thapa",
      phone: "9841234567",
      cityOrDistrict: "Kathmandu Inside Ring Road",
      address: "Boudha, Ward 6",
    },
    ...overrides,
  };
}

beforeEach(() => {
  resetOrders();
});

describe("placeOrder", () => {
  it("assigns sequential order numbers", () => {
    const first = placeOrder(makeDraft());
    const second = placeOrder(makeDraft());
    expect(first.id).toBe("NY-100001");
    expect(second.id).toBe("NY-100002");
    expect(getLastPlacedNumber()).toBe(100002);
  });

  it("stores the full order data", () => {
    const order = placeOrder(makeDraft());
    expect(order.status).toBe("Confirmed");
    expect(order.lines[0].size).toBe(42);
    expect(order.total).toBe(149.95);
    expect(new Date(order.placedAt).getTime()).toBeGreaterThan(0);
    expect(order.address.fullName).toBe("Shyam Thapa");
  });
});

describe("listOrdersForUser", () => {
  it("returns only the orders of that user, newest first", () => {
    placeOrder(makeDraft({ userId: "user-1" }));
    placeOrder(makeDraft({ userId: "user-2" }));
    const mine = listOrdersForUser("user-1");
    expect(mine).toHaveLength(1);
    expect(mine[0].userId).toBe("user-1");
  });

  it("keeps guest orders separate from accounts", () => {
    placeOrder(makeDraft({ userId: "guest" }));
    expect(listOrdersForUser("guest")).toHaveLength(1);
    expect(listOrdersForUser("user-1")).toHaveLength(0);
  });
});

describe("snapshots and state", () => {
  it("returns a stable (cached) server snapshot", () => {
    const a = getOrdersServerSnapshot();
    const b = getOrdersServerSnapshot();
    expect(a).toBe(b);
    expect(a).toEqual([]);
  });
});
