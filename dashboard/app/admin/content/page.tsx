"use client"

import { useState } from "react"
import { ContentEditor } from "@/components/dashboard/content-editor"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("editor")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <PageHeader title="Website Content Management" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="editor">Content Editor</TabsTrigger>
          <TabsTrigger value="preview">Website Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
          <ContentEditor />
        </TabsContent>

        <TabsContent value="preview">
          <div className="border rounded-lg p-4 bg-muted/20 min-h-[500px] flex items-center justify-center">
            <iframe src="/preview" className="w-full h-[600px] border-0 rounded-md" title="Website Preview" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

