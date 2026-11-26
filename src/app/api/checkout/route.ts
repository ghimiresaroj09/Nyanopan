import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = "https://nyanopan.onrender.com/api/v1/checkout/";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Checkout request failed:", error);
    return NextResponse.json(
      { success: false, message: "Unable to submit your order. Please try again." },
      { status: 503 }
    );
  }
}
