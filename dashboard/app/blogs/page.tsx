import { BlogTable } from "@/components/dashboard/blog-table"
import { BlogEditor } from "@/components/dashboard/blog-editor"
import { BlogList } from "@/components/dashboard/blog-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function BlogsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <PageHeader title="Blog Management">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Blog Post
        </Button>
      </PageHeader>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Blog List</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="editor">Blog Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <BlogList />
        </TabsContent>

        <TabsContent value="table">
          <BlogTable />
        </TabsContent>

        <TabsContent value="editor">
          <BlogEditor />
        </TabsContent>
      </Tabs>
    </div>
  )
}

