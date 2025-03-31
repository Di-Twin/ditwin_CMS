// Blog service for API calls

/**
 * Fetch all blogs
 */
export async function getAllBlogs() {
  try {
    const response = await fetch("https://dtwin-cms-api.evenbetter.in/api/blog", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching blogs:", error)
    throw error
  }
}

/**
 * Fetch a specific blog by ID
 */
export async function getBlogById(id: string) {
  try {
    const response = await fetch(`https://dtwin-cms-api.evenbetter.in/api/blog/${id}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching blog with ID ${id}:`, error)
    throw error
  }
}

/**
 * Create a new blog
 */
export async function createBlog(blogData: any) {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch("https://dtwin-cms-api.evenbetter.in/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(blogData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to create blog")
    }

    return data
  } catch (error) {
    console.error("Error creating blog:", error)
    throw error
  }
}

/**
 * Update an existing blog
 */
export async function updateBlog(id: string, blogData: any) {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Authentication required")
    }

    const response = await fetch(`https://dtwin-cms-api.evenbetter.in/api/blog/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(blogData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to update blog")
    }

    return data
  } catch (error) {
    console.error(`Error updating blog with ID ${id}:`, error)
    throw error
  }
}

/**
 * Delete a blog
 */
export async function deleteBlog(id: string) {
  try {
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("role")

    if (!token) {
      throw new Error("Authentication required")
    }

    if (userRole !== "admin") {
      throw new Error("Only admins can delete blog posts")
    }

    const response = await fetch(`https://dtwin-cms-api.evenbetter.in/api/blog/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete blog")
    }

    return data
  } catch (error) {
    console.error(`Error deleting blog with ID ${id}:`, error)
    throw error
  }
}

