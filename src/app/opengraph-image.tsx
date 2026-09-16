import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Static Open Graph image. Typographic only, so no third-party
 * assets are fetched at build time.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fdfcf9",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              backgroundColor: "#1e3a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#faf7f0",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            n
          </div>
          <div style={{ fontSize: 48, fontWeight: 700, color: "#1e3a2a" }}>
            nyanopan
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#23201a" }}>
            Premium hand felted slippers
          </div>
          <div style={{ fontSize: 32, color: "#6c6354" }}>
            Handmade in a fair trade workshop in Kathmandu, Nepal.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
