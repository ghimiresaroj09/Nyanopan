import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = "https://nyanopan.onrender.com/api/v1/subscription/";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Forward to backend API
    const response = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Failed to subscribe to newsletter" 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "An error occurred while processing your subscription" 
      },
      { status: 500 }
    );
  }
}
