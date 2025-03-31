import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Forward the request to the backend API
    const response = await fetch(
      `${process.env.BACKEND_API_URL || "https://dtwin-cms-api.evenbetter.in"}/auth/check-admin-exists`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Failed to check if admin exists" }, { status: response.status })
    }

    return NextResponse.json({ exists: data.exists })
  } catch (error: any) {
    console.error("Error checking if admin exists:", error)
    // Default to false if we can't check
    return NextResponse.json({ exists: false })
  }
}

