/**
 * Get the appropriate image size based on the device
 * @param url The original image URL
 * @param width The desired width
 * @returns The optimized image URL
 */
export function getResponsiveImageUrl(url: string, width: number): string {
  // If using Supabase Storage, we can use the transform API
  if (url.includes("supabase.co") && url.includes("storage/v1")) {
    // Extract the bucket and path from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")

    // Find the index of 'storage/v1/object/public'
    const publicIndex = pathParts.findIndex((part) => part === "public")

    if (publicIndex !== -1) {
      // Get the bucket and path
      const bucket = pathParts[publicIndex + 1]
      const path = pathParts.slice(publicIndex + 2).join("/")

      // Construct the transform URL
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`
      return `${baseUrl}/storage/v1/render/image/public/${bucket}/${path}?width=${width}&quality=80`
    }
  }

  // If not using Supabase or can't parse the URL, return the original
  return url
}

/**
 * Check if a URL is an image URL
 * @param url The URL to check
 * @returns True if the URL is an image URL
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false

  // Check if the URL ends with a common image extension
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif"]
  const lowercaseUrl = url.toLowerCase()

  return (
    imageExtensions.some((ext) => lowercaseUrl.endsWith(ext)) ||
    // Also check for image transform URLs
    lowercaseUrl.includes("render/image")
  )
}

