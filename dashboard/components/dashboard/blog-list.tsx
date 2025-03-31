"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash, Clock, CheckCircle } from "lucide-react"

type BlogPost = {
  id: string
  title: string
  excerpt: string
  date: string
  status: "draft" | "published" | "archived"
  featured: boolean
}

const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Heart Rate Variability",
    excerpt: "Learn how heart rate variability can provide insights into your overall health and stress levels.",
    date: "2023-06-15",
    status: "published",
    featured: true,
  },
  {
    id: "2",
    title: "The Connection Between Sleep and Health",
    excerpt: "Discover how quality sleep impacts your physical and mental wellbeing.",
    date: "2023-07-02",
    status: "published",
    featured: true,
  },
  {
    id: "3",
    title: "Nutrition Tracking: Beyond Calories",
    excerpt: "Why tracking macronutrients and micronutrients matters for optimal health.",
    date: "2023-07-20",
    status: "published",
    featured: false,
  },
  {
    id: "4",
    title: "Digital Health Trends for 2024",
    excerpt: "Exploring upcoming innovations in health monitoring technology.",
    date: "2023-08-05",
    status: "draft",
    featured: false,
  },
]

export function BlogList() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(mockBlogPosts)

  return (
    <div className="space-y-4">
      {blogPosts.map((post) => (
        <Card key={post.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>
                  {new Date(post.date).toLocaleDateString()} ·{" "}
                  {post.status === "published" ? "Published" : post.status === "draft" ? "Draft" : "Archived"}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {post.featured && <Badge variant="secondary">Featured</Badge>}
                <Badge variant={post.status === "published" ? "default" : "outline"}>
                  {post.status === "published" ? (
                    <CheckCircle className="mr-1 h-3 w-3" />
                  ) : (
                    <Clock className="mr-1 h-3 w-3" />
                  )}
                  {post.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

