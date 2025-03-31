// Content service for API calls

/**
 * Fetch all website content
 */
export async function getAllContent() {
  try {
    const response = await fetch("/api/content", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching content:", error)
    // Return empty array as fallback
    return []
  }
}

/**
 * Fetch specific section content
 */
export async function getSectionContent(section: string) {
  try {
    const response = await fetch(`/api/content/${section}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${section} content: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${section} content:`, error)
    // Return empty content as fallback
    return { content: {} }
  }
}

/**
 * Update section content
 * This only updates the content field, not the section name or structure
 */
export async function updateSectionContent(section: string, content: any) {
  try {
    const token = localStorage.getItem("token") || "mock-token"

    console.log(`Updating ${section} with:`, content) // Debug log

    const response = await fetch(`/api/content/${section}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error("Update failed with response:", responseData)
      throw new Error(responseData.error || `Failed to update content: ${response.statusText}`)
    }

    console.log("Update successful:", responseData) // Debug log
    return responseData
  } catch (error) {
    console.error(`Error updating ${section} content:`, error)
    throw error
  }
}

/**
 * Add a new section
 */
export async function addNewSection(section: string, content: any) {
  try {
    const token = localStorage.getItem("token") || "mock-token"

    console.log(`Adding new section ${section} with:`, content) // Debug log

    const response = await fetch(`/api/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ section, content }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error("Add section failed with response:", responseData)
      throw new Error(responseData.error || `Failed to add section: ${response.statusText}`)
    }

    console.log("Add section successful:", responseData) // Debug log
    return responseData
  } catch (error) {
    console.error(`Error adding section ${section}:`, error)
    throw error
  }
}

