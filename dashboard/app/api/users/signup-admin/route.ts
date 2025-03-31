import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Forward the request to the backend API
    const response = await fetch(
      `${process.env.BACKEND_API_URL || "https://dtwin-cms-api.evenbetter.in"}/auth/signup-admin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Failed to create admin account" }, { status: response.status })
    }

    return NextResponse.json({
      message: data.message || "Admin account created successfully",
      token: data.token,
    })
  } catch (error: any) {
    console.error("Error creating admin account:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

