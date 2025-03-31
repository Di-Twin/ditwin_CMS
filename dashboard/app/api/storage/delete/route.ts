import { type NextRequest, NextResponse } from "next/server"
import supabase from "@/config/supabase-client"

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const body = await request.json()
    const { filePath } = body

    if (!filePath) {
      return NextResponse.json({ error: "No file path provided" }, { status: 400 })
    }

    // Delete from Supabase
    const { error } = await supabase.storage.from("images").remove([filePath])

    if (error) {
      console.error("Supabase delete error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting file:", error)
    return NextResponse.json(
      {
        error: "Failed to delete file",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

