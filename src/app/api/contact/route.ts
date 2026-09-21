import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const BACKEND_API_URL = "https://nyanopan.onrender.com/api/v1/contact-us/";

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Forward the request to the backend API
    const response = await fetch(BACKEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone || "",
        subject: body.subject,
        message: body.message,
      }),
    });

    // Handle backend response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Backend API error:", errorData);
      
      return NextResponse.json(
        { 
          error: errorData.message || "Failed to submit contact form",
          details: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        { error: "Unable to reach the server. Please try again later." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
