import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the backend API
    const response = await fetch(`${process.env.BACKEND_API_URL || "https://dtwin-cms-api.evenbetter.in"}/api/blog`, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get the auth token from the request headers
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header is required" }, { status: 401 })
    }

    // Forward the request to the backend API
    const response = await fetch(`${process.env.BACKEND_API_URL || "https://dtwin-cms-api.evenbetter.in"}/api/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Failed to create blog" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: error.message || "Failed to create blog" }, { status: 500 })
  }
}

