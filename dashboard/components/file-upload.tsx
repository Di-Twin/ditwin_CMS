"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, Trash } from "lucide-react"
import { uploadFileToSupabase, deleteFileFromSupabase } from "@/utils/file-upload"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

interface FileUploadProps {
  id: string
  label: string
  value?: string
  onChange: (url: string) => void
  accept?: string
  className?: string
  folder?: string
  bucket?: string
}

export function FileUpload({
  id,
  label,
  value,
  onChange,
  accept = "image/*",
  className,
  folder = "",
  bucket = "website-content",
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const url = await uploadFileToSupabase(file, bucket, folder)
      onChange(url)
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully",
      })
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Clear the input value so the same file can be uploaded again if needed
      if (e.target) {
        e.target.value = ""
      }
    }
  }

  const handleDelete = async () => {
    if (!value) return

    setIsDeleting(true)
    try {
      await deleteFileFromSupabase(value, bucket)
      onChange("")
      toast({
        title: "File deleted",
        description: "Your file has been deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "There was an error deleting your file",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const isImage = accept.includes("image/") || accept === "image/*"

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2 mt-1.5">
        <Input id={id} type="file" accept={accept} onChange={handleFileChange} disabled={isUploading || isDeleting} />
        <Button variant="outline" size="icon" disabled={isUploading || isDeleting}>
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </div>
      {value && (
        <div className="mt-2 relative">
          {isImage ? (
            <div className="relative h-24 w-full max-w-xs bg-muted rounded-md overflow-hidden">
              <Image src={value || "/placeholder.svg"} alt={label} fill className="object-contain" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash className="h-3 w-3" />}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
              <span className="text-sm truncate max-w-[200px]">{value.split("/").pop()}</span>
              <Button
                variant="destructive"
                size="icon"
                className="h-6 w-6 ml-2"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash className="h-3 w-3" />}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

