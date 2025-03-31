import { type NextRequest, NextResponse } from "next/server"
import supabase from "@/config/supabase-client"

export const dynamic = "force-dynamic" // Ensure route is not cached

export async function GET(request: NextRequest) {
  // Set cache control headers to prevent caching
  const headers = new Headers({
    "Cache-Control": "no-store, max-age=0, must-revalidate",
    "Content-Type": "application/json",
  })

  try {
    // Try to fetch directly from Supabase
    const { data, error } = await supabase.from("website_content").select("*")

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json(data, { headers })
  } catch (error: any) {
    console.error("Error fetching content:", error)

    // Try to fetch from the backend API as fallback
    try {
      const response = await fetch("https://dtwin-cms-api.evenbetter.in/api/content", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.statusText}`)
      }

      const data = await response.json()
      return NextResponse.json(data, { headers })
    } catch (backendError) {
      console.error("Backend API error:", backendError)
      // Return empty array if both methods fail
      return NextResponse.json([], { headers })
    }
  }
}

export async function POST(request: NextRequest) {
  // Set cache control headers to prevent caching
  const headers = new Headers({
    "Cache-Control": "no-store, max-age=0, must-revalidate",
    "Content-Type": "application/json",
  })

  try {
    const body = await request.json()
    console.log("POST request body:", body)

    // Get the auth token from the request headers
    const authHeader = request.headers.get("Authorization")

    // Try to insert directly to Supabase
    const { data, error } = await supabase
      .from("website_content")
      .insert([{ section: body.section, content: body.content }])
      .select()

    if (error) {
      console.error("Supabase insert error:", error)

      // Try the backend API as fallback
      const response = await fetch("https://dtwin-cms-api.evenbetter.in/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader || "",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const responseData = await response.json()
        throw new Error(responseData.error || `Failed to add content: ${response.statusText}`)
      }

      const responseData = await response.json()
      return NextResponse.json(responseData, { headers })
    }

    return NextResponse.json(
      {
        message: `${body.section} added successfully!`,
        data,
      },
      { headers },
    )
  } catch (error: any) {
    console.error("Error adding content:", error)
    return NextResponse.json({ error: error.message || "Failed to add content" }, { status: 500, headers })
  }
}

