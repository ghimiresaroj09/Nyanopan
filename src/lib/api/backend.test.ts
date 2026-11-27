import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchNoStore } from "@/lib/api/backend";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchNoStore", () => {
  it("overrides cache settings to always request fresh backend data", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await fetchNoStore("https://api.nyanopan.com/api/v1/products/", {
      cache: "force-cache",
      method: "POST",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.nyanopan.com/api/v1/products/",
      { cache: "no-store", method: "POST" }
    );
  });
});
