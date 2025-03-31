"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2, ArrowLeft, Plus, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createBlog, updateBlog, getBlogById } from "@/services/blog-service"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import ReactMarkdown from "react-markdown"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const blogFormSchema = z.object({
  heading: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  main_tag: z.string().min(1, { message: "Please select a category" }),
  date: z.string().min(1, { message: "Please select a date" }),
  image: z.string().url({ message: "Please enter a valid image URL" }),
  image_alt: z.string().min(1, { message: "Please provide alt text for the image" }),
  tags: z.string().optional(),
})

type BlogFormProps = {
  id?: string
}

export function BlogForm({ id }: BlogFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [activeTab, setActiveTab] = useState("write")
  const [imageGallery, setImageGallery] = useState<Array<{ url: string; alt: string }>>([])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newImageAlt, setNewImageAlt] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      heading: "",
      content: "",
      main_tag: "",
      date: new Date().toISOString().split("T")[0],
      image: "",
      image_alt: "",
      tags: "",
    },
  })

  // Fetch blog data if editing
  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        setIsFetching(true)
        try {
          const blog = await getBlogById(id)

          // Set image gallery if it exists
          if (blog.image_gallery && Array.isArray(blog.image_gallery)) {
            setImageGallery(blog.image_gallery)
          }

          form.reset({
            heading: blog.heading,
            content: blog.content,
            main_tag: blog.main_tag,
            date: new Date(blog.date).toISOString().split("T")[0],
            image: blog.image,
            image_alt: blog.image_alt,
            tags: blog.tags ? blog.tags.join(", ") : "",
          })
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to load blog",
            variant: "destructive",
          })
        } finally {
          setIsFetching(false)
        }
      }

      fetchBlog()
    }
  }, [id, form, toast])

  const addImageToGallery = () => {
    if (!newImageUrl) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      })
      return
    }

    if (!newImageAlt) {
      toast({
        title: "Error",
        description: "Please enter alt text for the image",
        variant: "destructive",
      })
      return
    }

    setImageGallery([...imageGallery, { url: newImageUrl, alt: newImageAlt }])
    setNewImageUrl("")
    setNewImageAlt("")
  }

  const removeImageFromGallery = (index: number) => {
    const newGallery = [...imageGallery]
    newGallery.splice(index, 1)
    setImageGallery(newGallery)
  }

  async function onSubmit(values: z.infer<typeof blogFormSchema>) {
    setIsLoading(true)
    try {
      // Process tags from comma-separated string to array
      const tagsArray = values.tags ? values.tags.split(",").map((tag) => tag.trim()) : []

      const processedValues = {
        ...values,
        tags: tagsArray,
        image_gallery: imageGallery,
      }

      if (id) {
        // Update existing blog
        await updateBlog(id, processedValues)
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        })
      } else {
        // Create new blog
        await createBlog(processedValues)
        toast({
          title: "Success",
          description: "Blog post created successfully",
        })
      }

      // Redirect to blogs list
      router.push("/admin/blogs")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save blog post",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/blogs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
          <h2 className="text-2xl font-bold">{id ? "Edit Blog Post" : "Create New Blog Post"}</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="heading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="main_tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Alt Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe the image for accessibility" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Gallery */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="image-gallery">
                <AccordionTrigger>Image Gallery</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="new-image-url">Image URL</Label>
                        <Input
                          id="new-image-url"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-image-alt">Alt Text</Label>
                        <Input
                          id="new-image-alt"
                          value={newImageAlt}
                          onChange={(e) => setNewImageAlt(e.target.value)}
                          placeholder="Image description"
                        />
                      </div>
                    </div>
                    <Button type="button" onClick={addImageToGallery} variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Image
                    </Button>

                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Gallery Images</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/admin/image-gallery")}
                      >
                        Browse Gallery
                      </Button>
                    </div>

                    {imageGallery.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {imageGallery.map((image, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 border rounded-md">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                              <img
                                src={image.url || "/placeholder.svg"}
                                alt={image.alt}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{image.alt}</p>
                              <p className="text-xs text-muted-foreground truncate">{image.url}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeImageFromGallery(index)}
                              className="text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 border border-dashed rounded-md">
                        <p className="text-sm text-muted-foreground">No images added yet</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="mt-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your blog content here... Supports Markdown"
                          className="min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <Card>
                  <CardContent className="p-4 min-h-[300px]">
                    {form.watch("content") ? (
                      <div className="prose max-w-none dark:prose-invert">
                        <ReactMarkdown>{form.watch("content")}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nothing to preview yet.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="technology, web, development" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/blogs")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>

          <Card className="hidden md:block">
            <CardContent className="p-6">
              <div className="rounded-lg border border-dashed p-10 text-center">
                <h3 className="text-lg font-medium">Preview</h3>
                <p className="text-sm text-muted-foreground">Your blog post preview will appear here as you type.</p>
                {form.watch("image") && (
                  <div className="mt-4">
                    <img
                      src={form.watch("image") || "/placeholder.svg"}
                      alt={form.watch("image_alt") || "Blog preview"}
                      className="mx-auto max-h-48 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=200&width=400"
                      }}
                    />
                  </div>
                )}
                {form.watch("heading") && <h2 className="mt-4 text-xl font-bold">{form.watch("heading")}</h2>}
                {form.watch("main_tag") && (
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {form.watch("main_tag")}
                    </span>
                  </div>
                )}
                {form.watch("content") && (
                  <div className="mt-4 text-left">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {form.watch("content").substring(0, 150)}...
                    </p>
                  </div>
                )}

                {/* Gallery preview */}
                {imageGallery.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-left mb-2">Gallery ({imageGallery.length} images)</h4>
                    <div className="flex overflow-x-auto gap-2 pb-2">
                      {imageGallery.map((image, index) => (
                        <img
                          key={index}
                          src={image.url || "/placeholder.svg"}
                          alt={image.alt}
                          className="h-16 w-16 object-cover rounded-md flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Share links preview */}
                <div className="mt-4 text-left">
                  <h4 className="text-sm font-medium mb-2">Share on:</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">LinkedIn</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Twitter</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Facebook</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Instagram</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Auto-generated when published</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  )
}

