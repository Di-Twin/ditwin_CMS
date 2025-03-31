import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Search, BarChart, TrendingUp, Globe } from "lucide-react"
import { WebsiteSeo } from "@/components/dashboard/website-seo"

export default function SeoDashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <PageHeader title="SEO Optimizer Dashboard" />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall SEO Score</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keyword Rankings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Top 10 positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pages Optimized</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">5 need improvement</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO Performance</CardTitle>
          <CardDescription>Website performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
            <BarChart className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">SEO Performance Chart</span>
          </div>
        </CardContent>
      </Card>

      <WebsiteSeo />
    </div>
  )
}

