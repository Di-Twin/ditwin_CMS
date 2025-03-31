"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save } from "lucide-react"

export function SeoManager() {
  const [selectedPage, setSelectedPage] = useState("home")

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>SEO Meta Tags</CardTitle>
          <CardDescription>Optimize your website's meta tags for better search engine visibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="page">Select Page</Label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger id="page">
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home Page</SelectItem>
                  <SelectItem value="about">About Us</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="meta" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="meta">Meta Tags</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="meta" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input
                    id="meta-title"
                    placeholder="Enter meta title"
                    defaultValue={selectedPage === "home" ? "DI-Twin | Digital Twin Solutions" : ""}
                  />
                  <p className="text-xs text-muted-foreground">Recommended length: 50-60 characters</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    placeholder="Enter meta description"
                    defaultValue={
                      selectedPage === "home"
                        ? "DI-Twin provides cutting-edge digital twin solutions for industrial applications. Optimize your operations with our advanced simulation technology."
                        : ""
                    }
                  />
                  <p className="text-xs text-muted-foreground">Recommended length: 150-160 characters</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="keywords">Keywords (comma separated)</Label>
                  <Input
                    id="keywords"
                    placeholder="digital twin, simulation, industrial"
                    defaultValue={
                      selectedPage === "home" ? "digital twin, simulation, industrial, optimization, DI-Twin" : ""
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="og-title">Open Graph Title</Label>
                  <Input id="og-title" placeholder="Enter Open Graph title" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="og-description">Open Graph Description</Label>
                  <Textarea id="og-description" placeholder="Enter Open Graph description" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="og-image">Open Graph Image</Label>
                  <Input id="og-image" type="file" />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="canonical-url">Canonical URL</Label>
                  <Input id="canonical-url" placeholder="https://example.com/page" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="robots">Robots Meta Tag</Label>
                  <Select defaultValue="index-follow">
                    <SelectTrigger id="robots">
                      <SelectValue placeholder="Select robots meta tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="index-follow">index, follow</SelectItem>
                      <SelectItem value="noindex-follow">noindex, follow</SelectItem>
                      <SelectItem value="index-nofollow">index, nofollow</SelectItem>
                      <SelectItem value="noindex-nofollow">noindex, nofollow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="schema">Schema Markup (JSON-LD)</Label>
                  <Textarea
                    id="schema"
                    placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Analysis</CardTitle>
          <CardDescription>Review your current SEO performance and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Overall Score</h3>
              <Badge className="text-lg px-3 py-1">86%</Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Recommendations</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                    Warning
                  </Badge>
                  <span>Meta description is too short (120 characters). Aim for 150-160 characters.</span>
                </li>
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 bg-green-100 text-green-800 border-green-300">
                    Good
                  </Badge>
                  <span>Meta title length is optimal (54 characters).</span>
                </li>
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 bg-red-100 text-red-800 border-red-300">
                    Error
                  </Badge>
                  <span>Missing alt text for 2 images on the page.</span>
                </li>
                <li className="flex items-start">
                  <Badge variant="outline" className="mr-2 bg-green-100 text-green-800 border-green-300">
                    Good
                  </Badge>
                  <span>Page load speed is excellent (1.2s).</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

