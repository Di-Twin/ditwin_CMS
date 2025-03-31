import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Forward the request to the backend API
    const response = await fetch(
      `${process.env.BACKEND_API_URL || "https://dtwin-cms-api.evenbetter.in"}/api/blog/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch blog" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Get the auth token from the request headers
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header is required" }, { status: 401 })
    }

    // Forward the request to the backend API
    const response = await fetch(
      `${process.env.BACKEND_API_URL || "https://dtwin-cms-api.evenbetter.in"}/api/blog/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Failed to update blog" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: error.message || "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Get the auth token from the request headers
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization header is required" }, { status: 401 })
    }

    // Forward the request to the backend API
    const response = await fetch(
      `${process.env.BACKEND_API_URL || "https://dtwin-cms-api.evenbetter.in"}/api/blog/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
        },
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Failed to delete blog" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: error.message || "Failed to delete blog" }, { status: 500 })
  }
}

