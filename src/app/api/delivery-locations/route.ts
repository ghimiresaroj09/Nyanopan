import { NextResponse } from "next/server";

const BACKEND_API_URL = "https://nyanopan.onrender.com/api/v1/delivery-locations/";

export async function GET() {
  try {
    const response = await fetch(BACKEND_API_URL, { next: { revalidate: 300 } });
    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Unable to load delivery locations." },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json());
  } catch (error) {
    console.error("Delivery locations request failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to load delivery locations." },
      { status: 503 }
    );
  }
}
