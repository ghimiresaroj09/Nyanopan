import { describe, expect, it } from "vitest";

import { checkoutSchema } from "@/lib/schemas/checkout";
import { newsletterSchema } from "@/lib/schemas/newsletter";
import { parseSearchParams } from "@/lib/schemas/filters";

const VALID_CHECKOUT = {
  fullName: "Shyam Thapa",
  email: "shyam@example.com",
  phone: "9841234567",
  alternatePhone: "01-4455667",
  orderNote: "Please deliver after 2 PM",
  companyName: "Himalayan Goods Pvt Ltd",
  panVatNumber: "601234567",
  cityOrDistrict: "Kathmandu Inside Ring Road",
  address: "Boudha, Ward 6",
  landmark: "Near Stupa Gate 2",
};

describe("checkoutSchema", () => {
  it("accepts a valid checkout payload with all optional and required fields", () => {
    expect(checkoutSchema.safeParse(VALID_CHECKOUT).success).toBe(true);
  });

  it("accepts minimal required fields only", () => {
    const minimal = {
      fullName: "Shyam Thapa",
      email: "shyam@example.com",
      phone: "9841234567",
      cityOrDistrict: "Pokhara",
      address: "Lakeside Street 5",
    };
    expect(checkoutSchema.safeParse(minimal).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = checkoutSchema.safeParse({ ...VALID_CHECKOUT, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing full name", () => {
    const result = checkoutSchema.safeParse({ ...VALID_CHECKOUT, fullName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing phone number", () => {
    const result = checkoutSchema.safeParse({ ...VALID_CHECKOUT, phone: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid city/district not in Nepal list", () => {
    const result = checkoutSchema.safeParse({ ...VALID_CHECKOUT, cityOrDistrict: "New York" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty address", () => {
    const result = checkoutSchema.safeParse({ ...VALID_CHECKOUT, address: "" });
    expect(result.success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("accepts a valid email", () => {
    expect(newsletterSchema.safeParse({ email: "name@example.com" }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(newsletterSchema.safeParse({ email: "name@" }).success).toBe(false);
  });

  it("rejects an empty email", () => {
    expect(newsletterSchema.safeParse({ email: "" }).success).toBe(false);
  });
});

describe("parseSearchParams", () => {
  it("defaults to empty filters and featured sort", () => {
    const parsed = parseSearchParams({});
    expect(parsed.color).toEqual([]);
    expect(parsed.sole).toEqual([]);
    expect(parsed.size).toEqual([]);
    expect(parsed.sort).toBe("featured");
  });

  it("parses comma separated values", () => {
    const parsed = parseSearchParams({ color: "grey,blue", size: "38,39" });
    expect(parsed.color).toEqual(["grey", "blue"]);
    expect(parsed.size).toEqual([38, 39]);
  });

  it("drops unknown sole values", () => {
    const parsed = parseSearchParams({ sole: "leather,plastic" });
    expect(parsed.sole).toEqual(["leather"]);
  });

  it("falls back to featured for an unknown sort", () => {
    const parsed = parseSearchParams({ sort: "banana" });
    expect(parsed.sort).toBe("featured");
  });

  it("handles array style params from Next.js", () => {
    const parsed = parseSearchParams({ color: ["grey", "blue"] });
    expect(parsed.color).toEqual(["grey"]);
  });
});
