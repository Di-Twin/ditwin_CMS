import { SeoManager } from "@/components/dashboard/seo-manager"
import { WebsiteSeo } from "@/components/dashboard/website-seo"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SeoPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <PageHeader title="SEO Optimization" />

      <Tabs defaultValue="website" className="space-y-4">
        <TabsList>
          <TabsTrigger value="website">Website SEO</TabsTrigger>
          <TabsTrigger value="blog">Blog SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="website">
          <WebsiteSeo />
        </TabsContent>

        <TabsContent value="blog">
          <SeoManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}

