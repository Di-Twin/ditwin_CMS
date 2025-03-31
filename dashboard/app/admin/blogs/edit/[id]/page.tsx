import { BlogForm } from "@/components/dashboard/blog-form"

export default function EditBlogPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <BlogForm id={params.id} />
    </div>
  )
}

