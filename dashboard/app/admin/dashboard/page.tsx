"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Users, FileText, Eye, Edit, Globe } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import supabase from "@/config/supabase-client"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalImages: 0,
    pageViews: 1234, // Placeholder until Vercel Analytics integration
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true)
      try {
        // Fetch blog count
        const { count: blogCount, error: blogError } = await supabase
          .from("blogs")
          .select("*", { count: "exact", head: true })

        // Fetch image count
        const { count: imageCount, error: imageError } = await supabase
          .from("images")
          .select("*", { count: "exact", head: true })

        if (blogError) console.error("Error fetching blog count:", blogError)
        if (imageError) console.error("Error fetching image count:", imageError)

        setStats((prev) => ({
          ...prev,
          totalBlogs: blogCount || 0,
          totalImages: imageCount || 0,
        }))
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <PageHeader title="Admin Dashboard" />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Admin user</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBlogs}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalBlogs > 0 ? `${stats.totalBlogs} published posts` : "No posts yet"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Images</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalImages}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalImages > 0 ? `${stats.totalImages} images in gallery` : "No images yet"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pageViews}</div>
                <p className="text-xs text-muted-foreground">From Vercel Analytics</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Website Traffic</CardTitle>
                <CardDescription>Daily unique visitors over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">
                    Traffic data will be available from Vercel Analytics
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Website Content</CardTitle>
                <CardDescription>Manage your website content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-primary/10 p-2">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Content Management</p>
                    <p className="text-sm text-muted-foreground">Update website sections</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/admin/content">Manage Content</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Blog Management</CardTitle>
                <CardDescription>Create and manage blog posts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-primary/10 p-2">
                    <Edit className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stats.totalBlogs} blog posts</p>
                    <p className="text-sm text-muted-foreground">Manage your content</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/admin/blogs">Manage Blogs</Link>
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
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stats.totalImages} images</p>
                    <p className="text-sm text-muted-foreground">Upload and manage images</p>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/admin/image-gallery">Manage Images</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Integration</CardTitle>
              <CardDescription>Connect with Vercel Analytics for detailed insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full bg-muted/20 rounded-md flex flex-col items-center justify-center p-6">
                <BarChart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Vercel Analytics Integration</h3>
                <p className="text-center text-muted-foreground mb-6">
                  Analytics data will be available here once integrated with Vercel Analytics. This will provide
                  insights into page views, user behavior, and more.
                </p>
                <Button variant="outline" asChild>
                  <a href="https://vercel.com/docs/analytics" target="_blank" rel="noopener noreferrer">
                    Learn About Vercel Analytics
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

