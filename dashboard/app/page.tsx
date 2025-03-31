import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-bold">Welcome to DTwin CMS</h1>
        <p className="text-lg text-muted-foreground">
          Manage your website content, blogs, and SEO with our comprehensive content management system.
        </p>
        <div className="pt-4">
          <Button asChild size="lg" className="w-full">
            <Link href="/login">Login to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

