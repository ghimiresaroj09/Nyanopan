import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Generate the Apple touch icon
export default async function AppleIcon() {
  // Read the logo image
  const logoPath = join(process.cwd(), "public", "brand", "logo-cloud.png");
  const logoBuffer = await readFile(logoPath);
  const logoBase64 = logoBuffer.toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          padding: "20px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${logoBase64}`}
          alt="Nyanopan"
          width="140"
          height="84"
          style={{
            objectFit: "contain",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
