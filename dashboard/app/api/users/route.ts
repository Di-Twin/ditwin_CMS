import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from the request headers
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header is required" }, { status: 401 })
    }

    // Forward the request to the backend API
    const response = await fetch(`${process.env.BACKEND_API_URL || "https://dtwin-cms-api.evenbetter.in"}/auth/users`, {
      headers: {
        Authorization: authHeader,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Failed to fetch users" }, { status: response.status })
    }

    // Log the data to see what fields are being returned
    console.log("User data from backend:", data)

    // Return the users array from the response
    return NextResponse.json(data.users || [])
  } catch (error: any) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

