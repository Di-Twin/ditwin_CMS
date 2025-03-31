import { ImageGallery } from "@/components/dashboard/image-gallery"
import { PageHeader } from "@/components/page-header"

export default function ImageGalleryPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <PageHeader title="Image Gallery" />
      <ImageGallery />
    </div>
  )
}

