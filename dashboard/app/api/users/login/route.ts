import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Forward the request to the backend API
    const apiUrl = process.env.BACKEND_API_URL || "https://dtwin-cms-api.evenbetter.in"
    console.log(`Attempting login with backend API: ${apiUrl}/auth/login`)

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type")
    let data

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.error("Non-JSON response:", text)
      return NextResponse.json({ error: "Unexpected response from server" }, { status: 500 })
    }

    if (!response.ok) {
      console.error("Error response from backend:", data)
      return NextResponse.json({ error: data.error || "Login failed" }, { status: response.status })
    }

    return NextResponse.json({
      token: data.token,
      role: data.role,
      message: data.message || "Login successful",
    })
  } catch (error: any) {
    console.error("Error during login:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

