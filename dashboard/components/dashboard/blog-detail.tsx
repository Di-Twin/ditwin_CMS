"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Edit, Trash, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getBlogById, deleteBlog } from "@/services/blog-service"
import ReactMarkdown from "react-markdown"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

type BlogDetailProps = {
  id: string
}

export function BlogDetail({ id }: BlogDetailProps) {
  const [blog, setBlog] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true)
      try {
        const data = await getBlogById(id)
        setBlog(data)

        // Get user role from localStorage
        setUserRole(localStorage.getItem("role"))
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load blog",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlog()
  }, [id, toast])

  const handleEdit = () => {
    router.push(`/admin/blogs/edit/${id}`)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteBlog(id)
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      })
      router.push("/admin/blogs")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Blog post not found</h2>
        <Button className="mt-4" variant="outline" onClick={() => router.push("/admin/blogs")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blogs
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/admin/blogs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            {userRole === "admin" && (
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {blog.image && (
              <div className="mb-6">
                <img
                  src={blog.image || "/placeholder.svg"}
                  alt={blog.image_alt || "Blog image"}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=300&width=800"
                  }}
                />
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{blog.main_tag}</Badge>
              <span className="text-sm text-muted-foreground">{new Date(blog.date).toLocaleDateString()}</span>
            </div>

            <h1 className="text-3xl font-bold mb-6">{blog.heading}</h1>

            <div className="prose max-w-none dark:prose-invert">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>

            {/* Image Gallery */}
            {blog.image_gallery && blog.image_gallery.length > 0 && (
              <div className="mt-8 pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Image Gallery</h3>
                <Carousel className="w-full max-w-xl mx-auto">
                  <CarouselContent>
                    {blog.image_gallery.map((image: any, index: number) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <div className="overflow-hidden rounded-lg">
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={image.alt}
                              className="w-full h-64 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=300&width=600"
                              }}
                            />
                          </div>
                          <p className="mt-2 text-sm text-center text-muted-foreground">{image.alt}</p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}

            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Share Links */}
            {blog.share_links && Object.keys(blog.share_links).length > 0 && (
              <div className="mt-8 pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Share</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(blog.share_links).map(([platform, url]: [string, any]) => {
                    if (!url) return null
                    return (
                      <Button key={platform} variant="outline" size="sm" asChild>
                        <a href={url as string} target="_blank" rel="noopener noreferrer">
                          <Share2 className="mr-2 h-4 w-4" />
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      </Button>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  These share links are automatically generated based on your blog post.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

