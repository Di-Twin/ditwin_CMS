import supabase from "@/config/supabase-client"
import { v4 as uuidv4 } from "uuid"

/**
 * Upload a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The storage bucket name (default: 'website-content')
 * @param folder The folder path within the bucket (default: '')
 * @returns The public URL of the uploaded file
 */
export async function uploadFileToSupabase(file: File, bucket = "website-content", folder = ""): Promise<string> {
  try {
    // Generate a unique file name to prevent collisions
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`

    // Create the full path including folder if provided
    const filePath = folder ? `${folder}/${fileName}` : fileName

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      throw new Error(error.message)
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return urlData.publicUrl
  } catch (error) {
    console.error("Error uploading file to Supabase:", error)
    throw error
  }
}

/**
 * Delete a file from Supabase Storage
 * @param url The public URL of the file to delete
 * @param bucket The storage bucket name (default: 'website-content')
 */
export async function deleteFileFromSupabase(url: string, bucket = "website-content"): Promise<void> {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")

    // The file path is everything after the bucket name in the URL
    const bucketIndex = pathParts.findIndex((part) => part === bucket)
    if (bucketIndex === -1) {
      throw new Error("Invalid file URL")
    }

    const filePath = pathParts.slice(bucketIndex + 1).join("/")

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error("Error deleting file from Supabase:", error)
    throw error
  }
}

