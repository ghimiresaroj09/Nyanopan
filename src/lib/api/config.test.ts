import { afterEach, describe, expect, it, vi } from "vitest";

import { getSiteConfiguration } from "@/lib/api/config";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getSiteConfiguration", () => {
  it("requests fresh configuration instead of using Next.js data cache", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ data: { company_intro: "Nyanopan" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await getSiteConfiguration();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/v1\/configuration\/$/),
      { cache: "no-store" }
    );
  });
});
