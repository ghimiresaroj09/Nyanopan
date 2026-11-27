import { afterEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/delivery-locations/route";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("GET /api/delivery-locations", () => {
  it("returns fresh backend data with browser and CDN caching disabled", async () => {
    const payload = { success: true, data: [{ id: "1", name: "Kathmandu" }] };
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/v1\/delivery-locations\/$/),
      { cache: "no-store" }
    );
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    await expect(response.json()).resolves.toEqual(payload);
  });
});
