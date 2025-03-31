"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Trash, Copy, Check, Upload, ImageIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

type ImageItem = {
  id: string
  url: string
  alt: string
}

export function ImageGallery() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newImageAlt, setNewImageAlt] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Fetch images from the backend
  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch("https://dtwin-cms-api.evenbetter.in/api/images", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`)
      }

      const data = await response.json()
      setImages(data || [])
    } catch (error: any) {
      console.error("Error fetching images:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load images",
        variant: "destructive",
      })
      // Set empty array to avoid undefined errors
      setImages([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  // Add a new image via URL
  const handleAddImageUrl = async () => {
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

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch("https://dtwin-cms-api.evenbetter.in/api/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: newImageUrl,
          alt: newImageAlt,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add image")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Image added successfully",
      })

      // Add the image to the local state
      setImages([...images, data])

      // Reset form
      setNewImageUrl("")
      setNewImageAlt("")
    } catch (error: any) {
      console.error("Error adding image:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add image",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Upload a file directly to backend
  const handleFileUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
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

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Create a simulated progress update
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 5
          return newProgress < 90 ? newProgress : prev
        })
      }, 100)

      // Create form data for the file upload
      const formData = new FormData()
      formData.append("image", file)
      formData.append("alt", newImageAlt)

      // Get the token from localStorage for authentication
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication required")
      }

      // Upload the file to the backend
      const response = await fetch("https://dtwin-cms-api.evenbetter.in/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()
      setUploadProgress(100)

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })

      // Add the new image to the list
      setImages([...images, data])

      // Reset form
      setNewImageAlt("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error: any) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000) // Reset progress after a delay
    }
  }

  // Delete an image
  const handleDeleteImage = async (id: string) => {
    try {
      // Get the token from localStorage for authentication
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication required")
      }

      // Delete the image from the backend
      const response = await fetch(`https://dtwin-cms-api.evenbetter.in/api/images/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Delete failed")
      }

      toast({
        title: "Success",
        description: "Image deleted successfully",
      })

      // Remove the image from the local state
      setImages(images.filter((image) => image.id !== id))
    } catch (error: any) {
      console.error("Error deleting image:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      })
    }
  }

  // Copy image URL to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)

      toast({
        title: "Copied",
        description: "Image URL copied to clipboard",
      })
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Image Gallery</CardTitle>
          <CardDescription>Add and manage images for your blog posts and website content</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="gallery" className="space-y-4">
            <TabsList>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="add-url">Add via URL</TabsTrigger>
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-12 border rounded-md">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No images found. Add some images to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="aspect-video relative group">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => copyToClipboard(image.url, image.id)}>
                              {copiedId === image.id ? (
                                <Check className="h-4 w-4 mr-1" />
                              ) : (
                                <Copy className="h-4 w-4 mr-1" />
                              )}
                              Copy URL
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.id)}>
                              <Trash className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <div className="space-y-1">
                          <p className="font-medium text-sm truncate" title={image.alt}>
                            {image.alt}
                          </p>
                          <p className="text-xs text-muted-foreground truncate" title={image.url}>
                            {image.url.substring(0, 40)}...
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="add-url" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    placeholder="https://example.com/image.jpg"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Enter the URL of the image you want to add</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image-alt">Alt Text</Label>
                  <Input
                    id="image-alt"
                    placeholder="Descriptive text for the image"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Provide a description of the image for accessibility</p>
                </div>

                {newImageUrl && (
                  <div className="grid gap-2">
                    <Label>Preview</Label>
                    <div className="border rounded-md p-2 h-48 flex items-center justify-center overflow-hidden">
                      <img
                        src={newImageUrl || "/placeholder.svg"}
                        alt={newImageAlt || "Preview"}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                        }}
                      />
                    </div>
                  </div>
                )}

                <Button onClick={handleAddImageUrl} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Image
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="image-file">Upload Image</Label>
                  <Input id="image-file" type="file" accept="image/*" ref={fileInputRef} disabled={isUploading} />
                  <p className="text-xs text-muted-foreground">Select an image file to upload (JPG, PNG, GIF, etc.)</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="upload-alt">Alt Text</Label>
                  <Input
                    id="upload-alt"
                    placeholder="Descriptive text for the image"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    disabled={isUploading}
                  />
                  <p className="text-xs text-muted-foreground">Provide a description of the image for accessibility</p>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <Button onClick={handleFileUpload} disabled={isUploading || !newImageAlt} className="w-full">
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

