import { type NextRequest, NextResponse } from "next/server"
import supabase from "@/config/supabase-client"

export const dynamic = "force-dynamic" // Ensure route is not cached

export async function GET(request: NextRequest, { params }: { params: { section: string } }) {
  const section = params.section

  // Set cache control headers to prevent caching
  const headers = new Headers({
    "Cache-Control": "no-store, max-age=0, must-revalidate",
    "Content-Type": "application/json",
  })

  try {
    // Try to fetch directly from Supabase
    const { data, error } = await supabase.from("website_content").select("*").eq("section", section).single()

    if (error) {
      console.error(`Supabase error for section ${section}:`, error)

      // Try the backend API as fallback
      const response = await fetch(`https://dtwin-cms-api.evenbetter.in/api/content/${section}`, {
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
    }

    return NextResponse.json(data, { headers })
  } catch (error: any) {
    console.error(`Error fetching ${section} content:`, error)
    // Return empty content if both methods fail
    return NextResponse.json({ content: {} }, { headers })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { section: string } }) {
  const section = params.section

  // Set cache control headers to prevent caching
  const headers = new Headers({
    "Cache-Control": "no-store, max-age=0, must-revalidate",
    "Content-Type": "application/json",
  })

  try {
    const body = await request.json()
    console.log(`Updating section ${section} with:`, body) // Debug log

    // Get the auth token from the request headers
    const authHeader = request.headers.get("Authorization")

    // Try to update directly in Supabase
    const { data, error } = await supabase
      .from("website_content")
      .update({ content: body.content })
      .eq("section", section)
      .select()

    if (error) {
      console.error(`Supabase update error for section ${section}:`, error)

      // Try the backend API as fallback
      const response = await fetch(`https://dtwin-cms-api.evenbetter.in/api/content/${section}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader || "",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const responseData = await response.json()
        throw new Error(responseData.error || `Failed to update content: ${response.statusText}`)
      }

      const responseData = await response.json()
      return NextResponse.json(responseData, { headers })
    }

    return NextResponse.json(
      {
        message: `${section} updated successfully!`,
        data,
      },
      { headers },
    )
  } catch (error: any) {
    console.error(`Error updating ${section} content:`, error)
    return NextResponse.json(
      { error: error.message || `Failed to update ${section} content` },
      { status: 500, headers },
    )
  }
}

