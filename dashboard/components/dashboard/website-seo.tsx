"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Globe, FileText } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function WebsiteSeo() {
  const [selectedPage, setSelectedPage] = useState("home")

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Website SEO</CardTitle>
          <CardDescription>Optimize your website's SEO for better search engine visibility</CardDescription>
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
                  <SelectItem value="features">Features Page</SelectItem>
                  <SelectItem value="pricing">Pricing Page</SelectItem>
                  <SelectItem value="about">About Us</SelectItem>
                  <SelectItem value="contact">Contact Page</SelectItem>
                  <SelectItem value="blog">Blog Index</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic SEO</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input
                    id="meta-title"
                    placeholder="Enter meta title"
                    defaultValue={selectedPage === "home" ? "DTwin | Your Personal Health Assistant" : ""}
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
                        ? "Track your health metrics, get personalized insights, and take control of your wellbeing with DTwin's comprehensive health monitoring platform."
                        : ""
                    }
                  />
                  <p className="text-xs text-muted-foreground">Recommended length: 150-160 characters</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="keywords">Focus Keywords (comma separated)</Label>
                  <Input
                    id="keywords"
                    placeholder="health monitoring, digital twin, health tracking"
                    defaultValue={
                      selectedPage === "home"
                        ? "health monitoring, digital twin, health tracking, personal health assistant, health metrics"
                        : ""
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">https://dtwin.com/</span>
                    <Input
                      id="slug"
                      placeholder="page-slug"
                      defaultValue={selectedPage === "home" ? "" : selectedPage}
                      className="flex-1"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="og-title">Open Graph Title</Label>
                  <Input
                    id="og-title"
                    placeholder="Enter Open Graph title"
                    defaultValue={selectedPage === "home" ? "DTwin: Monitor Your Health in Real-Time" : ""}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="og-description">Open Graph Description</Label>
                  <Textarea
                    id="og-description"
                    placeholder="Enter Open Graph description"
                    defaultValue={
                      selectedPage === "home"
                        ? "Track vital signs, get personalized health insights, and take control of your wellbeing with our comprehensive health monitoring platform."
                        : ""
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="og-image">Open Graph Image</Label>
                  <Input id="og-image" type="file" />
                  <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">OG Image Preview</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="twitter-card">Twitter Card Type</Label>
                  <Select defaultValue="summary_large_image">
                    <SelectTrigger id="twitter-card">
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="summary_large_image">Summary with Large Image</SelectItem>
                      <SelectItem value="app">App</SelectItem>
                      <SelectItem value="player">Player</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="canonical-url">Canonical URL</Label>
                  <Input
                    id="canonical-url"
                    placeholder="https://dtwin.com/page"
                    defaultValue={`https://dtwin.com/${selectedPage === "home" ? "" : selectedPage}`}
                  />
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
                    className="font-mono text-sm"
                    defaultValue={
                      selectedPage === "home"
                        ? `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DTwin",
  "url": "https://dtwin.com",
  "logo": "https://dtwin.com/logo.png",
  "description": "Comprehensive health monitoring platform"
}`
                        : ""
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hreflang">Hreflang Tags</Label>
                  <Textarea
                    id="hreflang"
                    placeholder='<link rel="alternate" hreflang="en" href="https://dtwin.com/en" />'
                    className="font-mono text-sm"
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

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="seo-analysis">
          <AccordionTrigger>
            <div className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              SEO Analysis for{" "}
              {selectedPage === "home"
                ? "Home Page"
                : selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1) + " Page"}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Overall Score</h3>
                    <div className="text-lg font-bold text-green-600">86%</div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Recommendations</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="mr-2 rounded-full bg-yellow-100 text-yellow-800 p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <path d="M12 9v4" />
                            <path d="M12 17h.01" />
                          </svg>
                        </div>
                        <span>Meta description is too short (120 characters). Aim for 150-160 characters.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 rounded-full bg-green-100 text-green-800 p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        </div>
                        <span>Meta title length is optimal (54 characters).</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 rounded-full bg-red-100 text-red-800 p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                        </div>
                        <span>Missing alt text for 2 images on the page.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 rounded-full bg-green-100 text-green-800 p-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                        </div>
                        <span>Page load speed is excellent (1.2s).</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="blog-seo">
          <AccordionTrigger>
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Blog SEO Settings
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="blog-title-format">Blog Post Title Format</Label>
                    <Input
                      id="blog-title-format"
                      placeholder="Enter title format"
                      defaultValue="%post_title% | DI-Twin Health Blog"
                    />
                    <p className="text-xs text-muted-foreground">
                      Use %post_title% as a placeholder for the actual blog post title
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="blog-description-format">Blog Post Description Format</Label>
                    <Textarea
                      id="blog-description-format"
                      placeholder="Enter description format"
                      defaultValue="%post_excerpt% Read more health insights from DI-Twin."
                    />
                    <p className="text-xs text-muted-foreground">
                      Use %post_excerpt% as a placeholder for the blog post excerpt
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="blog-slug-format">Blog Post URL Format</Label>
                    <div className="flex items-center">
                      <span className="text-muted-foreground mr-2">https://ditwin.com/blog/</span>
                      <Select defaultValue="post-name">
                        <SelectTrigger id="blog-slug-format" className="flex-1">
                          <SelectValue placeholder="Select URL format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="post-name">post-name</SelectItem>
                          <SelectItem value="post-id">post-id</SelectItem>
                          <SelectItem value="category/post-name">category/post-name</SelectItem>
                          <SelectItem value="year/month/post-name">year/month/post-name</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Blog SEO Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

