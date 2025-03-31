"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Send } from "lucide-react"

export function BlogEditor() {
  const [content, setContent] = useState("")

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Enter blog title" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="main-tag">Main Tag</Label>
            <Select>
              <SelectTrigger id="main-tag">
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="featured-image">Featured Image</Label>
          <Input id="featured-image" type="file" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="alt-text">Image Alt Text</Label>
          <Input id="alt-text" placeholder="Describe the image for accessibility" />
        </div>

        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="mt-4">
            <Textarea
              placeholder="Write your blog content here... Supports Markdown"
              className="min-h-[300px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </TabsContent>
          <TabsContent value="preview" className="mt-4">
            <Card>
              <CardContent className="p-4 min-h-[300px]">
                {content ? (
                  <div className="prose max-w-none dark:prose-invert">{content}</div>
                ) : (
                  <p className="text-muted-foreground">Nothing to preview yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" placeholder="technology, web, development" />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <Card className="hidden md:block">
        <CardContent className="p-6">
          <div className="rounded-lg border border-dashed p-10 text-center">
            <h3 className="text-lg font-medium">Preview</h3>
            <p className="text-sm text-muted-foreground">Your blog post preview will appear here as you type.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

