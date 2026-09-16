import { describe, expect, it } from "vitest";

import { formatDate, formatOrderNumber, formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("formats rupees with two decimals and prefix", () => {
    expect(formatPrice(49.95)).toBe("Rs. 49.95");
  });

  it("pads whole rupee amounts", () => {
    expect(formatPrice(150)).toBe("Rs. 150.00");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("Rs. 0.00");
  });
});

describe("formatOrderNumber", () => {
  it("prefixes and pads to six digits", () => {
    expect(formatOrderNumber(7)).toBe("NY-000007");
    expect(formatOrderNumber(123456)).toBe("NY-123456");
  });
});

describe("formatDate", () => {
  it("renders a long date", () => {
    expect(formatDate(new Date(2026, 8, 14))).toBe("14 September 2026");
  });
});
