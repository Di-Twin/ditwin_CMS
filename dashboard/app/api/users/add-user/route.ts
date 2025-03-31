import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, role } = body

    if (!email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Get the auth token from the request headers
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header is required" }, { status: 401 })
    }

    // Forward the request to the backend API
    const apiUrl = process.env.BACKEND_API_URL || "https://dtwin-cms-api.evenbetter.in"

    console.log(`Forwarding add-user request to: ${apiUrl}/auth/add-user`)

    const response = await fetch(`${apiUrl}/auth/add-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ email, password, role }),
      cache: "no-store",
    })

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type")
    let data

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.error("Non-JSON response:", text)
      data = { error: "Unexpected response from server" }
    }

    if (!response.ok) {
      console.error("Error response from backend:", data)
      return NextResponse.json(
        {
          error: data.error || "Failed to add user",
          details: data.details || response.statusText,
        },
        { status: response.status },
      )
    }

    return NextResponse.json({
      message: data.message || "User added successfully",
      details: data.details,
    })
  } catch (error: any) {
    console.error("Error adding user:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

