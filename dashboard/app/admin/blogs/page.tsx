import { BlogTable } from "@/components/dashboard/blog-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import Link from "next/link"

export default function BlogsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <PageHeader title="Blog Management">
        <Button asChild>
          <Link href="/admin/blogs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Blog Post
          </Link>
        </Button>
      </PageHeader>

      <BlogTable />
    </div>
  )
}

