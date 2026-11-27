import { NextResponse } from "next/server";
import { backendApiUrl } from "@/lib/api/backend";

const BACKEND_API_URL = backendApiUrl("delivery-locations/");

export async function GET() {
  try {
    const response = await fetch(BACKEND_API_URL, { cache: "no-store" });
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Unable to load delivery locations." },
        {
          status: response.status,
          headers: { "Cache-Control": "private, no-store, max-age=0, must-revalidate" },
        }
      );
    }

    return NextResponse.json(await response.json(), {
      headers: { "Cache-Control": "private, no-store, max-age=0, must-revalidate" },
    });
  } catch (error) {
    console.error("Delivery locations request failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to load delivery locations." },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store, max-age=0, must-revalidate" },
      }
    );
  }
}
