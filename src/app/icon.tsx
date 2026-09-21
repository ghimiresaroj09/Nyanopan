import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// Image metadata
export const size = {
  width: 48,
  height: 48,
};
export const contentType = "image/png";

// Generate the icon
export default async function Icon() {
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
          backgroundColor: "transparent",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${logoBase64}`}
          alt="Nyanopan"
          width="48"
          height="29"
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
