"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { FileText, Image, Plus, Clock, Eye, Edit } from "lucide-react"
import Link from "next/link"
import { getAllBlogs } from "@/services/blog-service"
import { useRouter } from "next/navigation"

export default function EditorDashboardPage() {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    draftBlogs: 0,
  })
  const [recentBlogs, setRecentBlogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // Fetch blogs
        const blogs = await getAllBlogs()

        // Set recent blogs (latest 3)
        const sortedBlogs = [...blogs]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)

        setRecentBlogs(sortedBlogs)

        // Count draft blogs (if your API provides a status field)
        const drafts = blogs.filter((blog) => blog.status === "draft").length

        setStats({
          ...stats,
          totalBlogs: blogs.length,
          draftBlogs: drafts,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <PageHeader title="Content Editor Dashboard">
        <Button asChild>
          <Link href="/editor/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Blog Post
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogs}</div>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftBlogs}</div>
            <p className="text-xs text-muted-foreground">Waiting to be published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" size="sm" className="w-full justify-start">
              <Link href="/editor/blogs/new">
                <FileText className="mr-2 h-4 w-4" />
                New Blog Post
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full justify-start">
              <Link href="/editor/image-gallery">
                <Image className="mr-2 h-4 w-4" />
                Upload Image
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Blog Posts</CardTitle>
            <CardDescription>Your most recently published articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBlogs.length > 0 ? (
                recentBlogs.map((blog) => (
                  <div key={blog.id} className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{blog.heading}</p>
                      <p className="text-sm text-muted-foreground">{new Date(blog.date).toLocaleDateString()}</p>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => router.push(`/editor/blogs/${blog.id}`)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => router.push(`/editor/blogs/edit/${blog.id}`)}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No blog posts yet. Create your first one!</p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button asChild variant="outline" className="w-full">
                <Link href="/editor/blogs">View All Blog Posts</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Blog Management</CardTitle>
            <CardDescription>Create and manage your blog posts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{stats.totalBlogs} blog posts</p>
                <p className="text-sm text-muted-foreground">Manage your content</p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href="/editor/blogs">Manage Blogs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image Gallery</CardTitle>
            <CardDescription>Manage your media library</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-primary/10 p-2">
                <Image className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Media Library</p>
                <p className="text-sm text-muted-foreground">Upload and manage images</p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href="/editor/image-gallery">Manage Images</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

