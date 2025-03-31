import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import supabase from "@/config/supabase-client"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the form data
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `uploads/${fileName}`

    // Convert file to buffer
    const buffer = await file.arrayBuffer()

    // Ensure the bucket exists
    try {
      const { data: buckets } = await supabase.storage.listBuckets()

      const bucketExists = buckets?.some((bucket) => bucket.name === "images")

      if (!bucketExists) {
        await supabase.storage.createBucket("images", {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        })
      }
    } catch (error) {
      console.error("Error checking/creating bucket:", error)
    }

    // Upload to Supabase
    const { data, error } = await supabase.storage.from("images").upload(filePath, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get the public URL
    const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath,
    })
  } catch (error: any) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

