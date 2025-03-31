import { BlogDetail } from "@/components/dashboard/blog-detail"

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <BlogDetail id={params.id} />
    </div>
  )
}

