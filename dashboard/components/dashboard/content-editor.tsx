"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Eye, Loader2, RefreshCw } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { getSectionContent, updateSectionContent, getAllContent } from "@/services/content-service"
import Image from "next/image"

// Define section options based on the provided JSON structure
const SECTION_OPTIONS = [
  { value: "header", label: "Header" },
  { value: "hero", label: "Hero Section" },
  { value: "supported_integrations", label: "Supported Integrations" },
  { value: "features_one", label: "Features One" },
  { value: "long_features", label: "Long Features" },
  { value: "dropdown_features", label: "Dropdown Features" },
  { value: "why_us", label: "Why Us" },
  { value: "news", label: "News" },
  { value: "call_to_action", label: "Call to Action" },
  { value: "footer", label: "Footer" },
]

export function ContentEditor() {
  const [selectedSection, setSelectedSection] = useState("header")
  const [sectionContent, setSectionContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [availableSections, setAvailableSections] = useState<string[]>([])
  const { toast } = useToast()

  // Fetch all available sections on initial load
  const fetchAvailableSections = useCallback(async () => {
    try {
      const data = await getAllContent()
      const sections = data.map((item: any) => item.section)
      setAvailableSections(sections)
    } catch (error) {
      console.error("Error fetching available sections:", error)
      toast({
        title: "Error",
        description: "Failed to load available sections",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    fetchAvailableSections()
  }, [fetchAvailableSections])

  // Fetch content when section changes
  const fetchContent = useCallback(async () => {
    if (!selectedSection) return

    setIsLoading(true)
    try {
      const data = await getSectionContent(selectedSection)
      setSectionContent(data.content)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to load ${selectedSection} content`,
        variant: "destructive",
      })
      // Initialize with empty content if fetch fails
      setSectionContent({})
    } finally {
      setIsLoading(false)
    }
  }, [selectedSection, toast])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  // Refresh content
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchContent()
      toast({
        title: "Content refreshed",
        description: "The content has been refreshed from the server",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Generic function to update nested content
  const updateNestedContent = (path: string[], value: any) => {
    setSectionContent((prevContent: any) => {
      const newContent = { ...prevContent }
      let current = newContent

      // Navigate to the parent object
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {}
        }
        current = current[path[i]]
      }

      // Set the value at the final path
      current[path[path.length - 1]] = value

      return newContent
    })
  }

  // Save content changes
  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSectionContent(selectedSection, sectionContent)
      toast({
        title: "Success",
        description: `${selectedSection} content updated successfully!`,
      })

      // Refresh available sections after saving
      await fetchAvailableSections()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update ${selectedSection} content`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Render form fields based on section and content structure
  const renderFormFields = () => {
    if (!sectionContent) return null

    switch (selectedSection) {
      case "header":
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={sectionContent.logo || ""}
                onChange={(e) => updateNestedContent(["logo"], e.target.value)}
                placeholder="/images/logo.svg"
              />
              {sectionContent.logo && (
                <div className="mt-2 p-2 border rounded-md">
                  <Image
                    src={sectionContent.logo || "/placeholder.svg"}
                    alt="Logo"
                    width={200}
                    height={60}
                    className="h-10 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Menu Items</Label>
              {sectionContent.menus?.map((item: string, index: number) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`menu-${index}`}>Menu {index + 1}</Label>
                  <Input
                    id={`menu-${index}`}
                    value={item}
                    onChange={(e) => {
                      const newMenus = [...sectionContent.menus]
                      newMenus[index] = e.target.value
                      updateNestedContent(["menus"], newMenus)
                    }}
                    placeholder={`Menu ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="button">Button Text</Label>
              <Input
                id="button"
                value={sectionContent.button || ""}
                onChange={(e) => updateNestedContent(["button"], e.target.value)}
                placeholder="Button Text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="button_url">Button URL</Label>
              <Input
                id="button_url"
                value={sectionContent.button_url || ""}
                onChange={(e) => updateNestedContent(["button_url"], e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        )

      case "hero":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={sectionContent.heading || ""}
                onChange={(e) => updateNestedContent(["heading"], e.target.value)}
                placeholder="Main Heading"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                value={sectionContent.details || ""}
                onChange={(e) => updateNestedContent(["details"], e.target.value)}
                placeholder="Hero description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Buttons</Label>
              {sectionContent.buttons?.map((item: string, index: number) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`button-${index}`}>Button {index + 1} Text</Label>
                  <Input
                    id={`button-${index}`}
                    value={item}
                    onChange={(e) => {
                      const newButtons = [...sectionContent.buttons]
                      newButtons[index] = e.target.value
                      updateNestedContent(["buttons"], newButtons)
                    }}
                    placeholder={`Button ${index + 1}`}
                  />

                  <Label htmlFor={`button-url-${index}`}>Button {index + 1} URL</Label>
                  <Input
                    id={`button-url-${index}`}
                    value={sectionContent.button_url?.[index] || ""}
                    onChange={(e) => {
                      const newButtonUrls = [...(sectionContent.button_url || [])]
                      newButtonUrls[index] = e.target.value
                      updateNestedContent(["button_url"], newButtonUrls)
                    }}
                    placeholder="https://example.com"
                  />
                </div>
              ))}
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="images">
                <AccordionTrigger>Images</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {sectionContent.images &&
                      Object.entries(sectionContent.images).map(([key, value]: [string, any]) => (
                        <div key={key} className="space-y-2 border p-3 rounded-md">
                          <h4 className="font-medium">{key}</h4>
                          <Label htmlFor={`image-${key}`}>Image URL</Label>
                          <Input
                            id={`image-${key}`}
                            value={value}
                            onChange={(e) => {
                              const newImages = { ...sectionContent.images }
                              newImages[key] = e.target.value
                              updateNestedContent(["images"], newImages)
                            }}
                            placeholder="Image URL"
                          />
                          {value && (
                            <div className="mt-2 p-2 border rounded-md">
                              <Image
                                src={(value as string) || "/placeholder.svg"}
                                alt={key}
                                width={200}
                                height={150}
                                className="h-24 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg"
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )

      case "supported_integrations":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={sectionContent.description || ""}
                onChange={(e) => updateNestedContent(["description"], e.target.value)}
                placeholder="Section description"
              />
            </div>

            <div className="space-y-2">
              <Label>Logos</Label>
              {sectionContent.logos?.map((logo: string, index: number) => (
                <div key={index} className="space-y-2 border p-3 rounded-md">
                  <Label htmlFor={`logo-${index}`}>Logo {index + 1}</Label>
                  <Input
                    id={`logo-${index}`}
                    value={logo}
                    onChange={(e) => {
                      const newLogos = [...sectionContent.logos]
                      newLogos[index] = e.target.value
                      updateNestedContent(["logos"], newLogos)
                    }}
                    placeholder="Logo URL"
                  />
                  {logo && (
                    <div className="mt-2 p-2 border rounded-md">
                      <Image
                        src={logo || "/placeholder.svg"}
                        alt={`Logo ${index + 1}`}
                        width={100}
                        height={50}
                        className="h-12 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case "features_one":
        return (
          <div className="space-y-4">
            <Accordion type="single" collapsible defaultValue="top_section" className="w-full">
              <AccordionItem value="top_section">
                <AccordionTrigger>Top Section</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="top-heading">Heading</Label>
                      <Input
                        id="top-heading"
                        value={sectionContent.top_section?.heading || ""}
                        onChange={(e) => updateNestedContent(["top_section", "heading"], e.target.value)}
                        placeholder="Section Heading"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="top-paragraph">Paragraph</Label>
                      <Textarea
                        id="top-paragraph"
                        value={sectionContent.top_section?.paragraph || ""}
                        onChange={(e) => updateNestedContent(["top_section", "paragraph"], e.target.value)}
                        placeholder="Section paragraph"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Bullet Points</Label>
                      <div className="space-y-4 border p-4 rounded-md">
                        {sectionContent.top_section?.bullet_points?.map((point: any, index: number) => (
                          <div key={index} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
                            <h4 className="font-medium">Point {index + 1}</h4>

                            <div className="space-y-2">
                              <Label htmlFor={`point-title-${index}`}>Title</Label>
                              <Input
                                id={`point-title-${index}`}
                                value={point.title || ""}
                                onChange={(e) => {
                                  const newPoints = [...sectionContent.top_section.bullet_points]
                                  newPoints[index] = { ...newPoints[index], title: e.target.value }
                                  updateNestedContent(["top_section", "bullet_points"], newPoints)
                                }}
                                placeholder="Point title"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`point-desc-${index}`}>Description</Label>
                              <Input
                                id={`point-desc-${index}`}
                                value={point.description || ""}
                                onChange={(e) => {
                                  const newPoints = [...sectionContent.top_section.bullet_points]
                                  newPoints[index] = { ...newPoints[index], description: e.target.value }
                                  updateNestedContent(["top_section", "bullet_points"], newPoints)
                                }}
                                placeholder="Point description"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="second_section">
                <AccordionTrigger>Second Section</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="second-heading">Heading</Label>
                      <Input
                        id="second-heading"
                        value={sectionContent.second_section?.heading || ""}
                        onChange={(e) => updateNestedContent(["second_section", "heading"], e.target.value)}
                        placeholder="Section Heading"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="second-paragraph">Paragraph</Label>
                      <Textarea
                        id="second-paragraph"
                        value={sectionContent.second_section?.paragraph || ""}
                        onChange={(e) => updateNestedContent(["second_section", "paragraph"], e.target.value)}
                        placeholder="Section paragraph"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Bullet Points</Label>
                      <div className="space-y-4 border p-4 rounded-md">
                        {sectionContent.second_section?.bullet_points?.map((point: any, index: number) => (
                          <div key={index} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
                            <h4 className="font-medium">Point {index + 1}</h4>

                            <div className="space-y-2">
                              <Label htmlFor={`second-point-title-${index}`}>Title</Label>
                              <Input
                                id={`second-point-title-${index}`}
                                value={point.title || ""}
                                onChange={(e) => {
                                  const newPoints = [...sectionContent.second_section.bullet_points]
                                  newPoints[index] = { ...newPoints[index], title: e.target.value }
                                  updateNestedContent(["second_section", "bullet_points"], newPoints)
                                }}
                                placeholder="Point title"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`second-point-desc-${index}`}>Description</Label>
                              <Input
                                id={`second-point-desc-${index}`}
                                value={point.description || ""}
                                onChange={(e) => {
                                  const newPoints = [...sectionContent.second_section.bullet_points]
                                  newPoints[index] = { ...newPoints[index], description: e.target.value }
                                  updateNestedContent(["second_section", "bullet_points"], newPoints)
                                }}
                                placeholder="Point description"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="images">
                <AccordionTrigger>Images</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {sectionContent.images &&
                      Object.entries(sectionContent.images).map(([key, value]: [string, any]) => (
                        <div key={key} className="space-y-2 border p-3 rounded-md">
                          <h4 className="font-medium">{key}</h4>
                          <Label htmlFor={`image-${key}`}>Image URL</Label>
                          <Input
                            id={`image-${key}`}
                            value={value}
                            onChange={(e) => {
                              const newImages = { ...sectionContent.images }
                              newImages[key] = e.target.value
                              updateNestedContent(["images"], newImages)
                            }}
                            placeholder="Image URL"
                          />
                          {value && (
                            <div className="mt-2 p-2 border rounded-md">
                              <Image
                                src={(value as string) || "/placeholder.svg"}
                                alt={key}
                                width={200}
                                height={150}
                                className="h-24 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg"
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )

      case "long_features":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="main_heading">Main Heading</Label>
              <Input
                id="main_heading"
                value={sectionContent.main_heading || ""}
                onChange={(e) => updateNestedContent(["main_heading"], e.target.value)}
                placeholder="Main Heading"
              />
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="cards">
                <AccordionTrigger>Cards</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {sectionContent.cards?.map((card: any, index: number) => (
                      <div key={index} className="space-y-2 border p-3 rounded-md">
                        <h4 className="font-medium">Card {index + 1}</h4>

                        <div className="space-y-2">
                          <Label htmlFor={`card-id-${index}`}>ID</Label>
                          <Input
                            id={`card-id-${index}`}
                            value={card.id || ""}
                            onChange={(e) => {
                              const newCards = [...sectionContent.cards]
                              newCards[index] = { ...newCards[index], id: Number.parseInt(e.target.value) || 0 }
                              updateNestedContent(["cards"], newCards)
                            }}
                            placeholder="Card ID"
                            type="number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`card-mockup-${index}`}>Mockup URL</Label>
                          <Input
                            id={`card-mockup-${index}`}
                            value={card.mockup || ""}
                            onChange={(e) => {
                              const newCards = [...sectionContent.cards]
                              newCards[index] = { ...newCards[index], mockup: e.target.value }
                              updateNestedContent(["cards"], newCards)
                            }}
                            placeholder="Mockup URL"
                          />
                          {card.mockup && (
                            <div className="mt-2 p-2 border rounded-md">
                              <Image
                                src={card.mockup || "/placeholder.svg"}
                                alt={`Card ${index + 1} Mockup`}
                                width={200}
                                height={150}
                                className="h-24 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg"
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`card-title-${index}`}>Title</Label>
                          <Input
                            id={`card-title-${index}`}
                            value={card.title || ""}
                            onChange={(e) => {
                              const newCards = [...sectionContent.cards]
                              newCards[index] = { ...newCards[index], title: e.target.value }
                              updateNestedContent(["cards"], newCards)
                            }}
                            placeholder="Card Title"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`card-desc-${index}`}>Description</Label>
                          <Textarea
                            id={`card-desc-${index}`}
                            value={card.description || ""}
                            onChange={(e) => {
                              const newCards = [...sectionContent.cards]
                              newCards[index] = { ...newCards[index], description: e.target.value }
                              updateNestedContent(["cards"], newCards)
                            }}
                            placeholder="Card Description"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )

      case "dropdown_features":
        return (
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="left">
                <AccordionTrigger>Left Section</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {sectionContent.left?.map((item: any, index: number) => (
                      <div key={index} className="space-y-2 border p-3 rounded-md">
                        <h4 className="font-medium">Item {index + 1}</h4>

                        <div className="space-y-2">
                          <Label htmlFor={`left-title-${index}`}>Title</Label>
                          <Input
                            id={`left-title-${index}`}
                            value={item.title || ""}
                            onChange={(e) => {
                              const newLeft = [...sectionContent.left]
                              newLeft[index] = { ...newLeft[index], title: e.target.value }
                              updateNestedContent(["left"], newLeft)
                            }}
                            placeholder="Title"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`left-desc-${index}`}>Description</Label>
                          <Textarea
                            id={`left-desc-${index}`}
                            value={item.description || ""}
                            onChange={(e) => {
                              const newLeft = [...sectionContent.left]
                              newLeft[index] = { ...newLeft[index], description: e.target.value }
                              updateNestedContent(["left"], newLeft)
                            }}
                            placeholder="Description"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="right">
                <AccordionTrigger>Right Section</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="right-heading">Heading</Label>
                      <Input
                        id="right-heading"
                        value={sectionContent.right?.heading || ""}
                        onChange={(e) => updateNestedContent(["right", "heading"], e.target.value)}
                        placeholder="Heading"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="right-paragraph1">Paragraph 1</Label>
                      <Textarea
                        id="right-paragraph1"
                        value={sectionContent.right?.paragraph1 || ""}
                        onChange={(e) => updateNestedContent(["right", "paragraph1"], e.target.value)}
                        placeholder="Paragraph 1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="right-paragraph2">Paragraph 2</Label>
                      <Textarea
                        id="right-paragraph2"
                        value={sectionContent.right?.paragraph2 || ""}
                        onChange={(e) => updateNestedContent(["right", "paragraph2"], e.target.value)}
                        placeholder="Paragraph 2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="right-cta-button">CTA Button Text</Label>
                      <Input
                        id="right-cta-button"
                        value={sectionContent.right?.cta_button || ""}
                        onChange={(e) => updateNestedContent(["right", "cta_button"], e.target.value)}
                        placeholder="CTA Button Text"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="right-cta-url">CTA Button URL</Label>
                      <Input
                        id="right-cta-url"
                        value={sectionContent.right?.cta_button_url || ""}
                        onChange={(e) => updateNestedContent(["right", "cta_button_url"], e.target.value)}
                        placeholder="CTA Button URL"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )

      case "why_us":
        return (
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="first_section">
                <AccordionTrigger>First Section</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-heading">Heading</Label>
                      <Input
                        id="first-heading"
                        value={sectionContent.first_section?.heading || ""}
                        onChange={(e) => updateNestedContent(["first_section", "heading"], e.target.value)}
                        placeholder="Section Heading"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="first-paragraph">Paragraph</Label>
                      <Textarea
                        id="first-paragraph"
                        value={sectionContent.first_section?.paragraph || ""}
                        onChange={(e) => updateNestedContent(["first_section", "paragraph"], e.target.value)}
                        placeholder="Section paragraph"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="first-image">Image URL</Label>
                      <Input
                        id="first-image"
                        value={sectionContent.first_section?.image || ""}
                        onChange={(e) => updateNestedContent(["first_section", "image"], e.target.value)}
                        placeholder="Image URL"
                      />
                      {sectionContent.first_section?.image && (
                        <div className="mt-2 p-2 border rounded-md">
                          <Image
                            src={sectionContent.first_section.image || "/placeholder.svg"}
                            alt="Section Image"
                            width={200}
                            height={150}
                            className="h-24 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Stats</Label>
                      <div className="space-y-4">
                        {sectionContent.first_section?.stats?.map((stat: any, index: number) => (
                          <div key={index} className="space-y-2 border p-3 rounded-md">
                            <h4 className="font-medium">Stat {index + 1}</h4>

                            <div className="space-y-2">
                              <Label htmlFor={`stat-number-${index}`}>Number</Label>
                              <Input
                                id={`stat-number-${index}`}
                                value={stat.number || ""}
                                onChange={(e) => {
                                  const newStats = [...sectionContent.first_section.stats]
                                  newStats[index] = { ...newStats[index], number: e.target.value }
                                  updateNestedContent(["first_section", "stats"], newStats)
                                }}
                                placeholder="Stat Number"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`stat-desc-${index}`}>Description</Label>
                              <Input
                                id={`stat-desc-${index}`}
                                value={stat.description || ""}
                                onChange={(e) => {
                                  const newStats = [...sectionContent.first_section.stats]
                                  newStats[index] = { ...newStats[index], description: e.target.value }
                                  updateNestedContent(["first_section", "stats"], newStats)
                                }}
                                placeholder="Stat Description"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="second_section">
                <AccordionTrigger>Second Section</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="second-heading">Heading</Label>
                      <Input
                        id="second-heading"
                        value={sectionContent.second_section?.heading || ""}
                        onChange={(e) => updateNestedContent(["second_section", "heading"], e.target.value)}
                        placeholder="Section Heading"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="second-paragraph">Paragraph</Label>
                      <Textarea
                        id="second-paragraph"
                        value={sectionContent.second_section?.paragraph || ""}
                        onChange={(e) => updateNestedContent(["second_section", "paragraph"], e.target.value)}
                        placeholder="Section paragraph"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Points</Label>
                      <div className="space-y-4">
                        {sectionContent.second_section?.points?.map((point: any, index: number) => (
                          <div key={index} className="space-y-2 border p-3 rounded-md">
                            <h4 className="font-medium">Point {index + 1}</h4>

                            <div className="space-y-2">
                              <Label htmlFor={`point-id-${index}`}>ID</Label>
                              <Input
                                id={`point-id-${index}`}
                                value={point.id || ""}
                                onChange={(e) => {
                                  const newPoints = [...sectionContent.second_section.points]
                                  newPoints[index] = { ...newPoints[index], id: Number.parseInt(e.target.value) || 0 }
                                  updateNestedContent(["second_section", "points"], newPoints)
                                }}
                                placeholder="Point ID"
                                type="number"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`point-title-${index}`}>Title</Label>
                              <Input
                                id={`point-title-${index}`}
                                value={point.title || ""}
                                onChange={(e) => {
                                  const newPoints = [...sectionContent.second_section.points]
                                  newPoints[index] = { ...newPoints[index], title: e.target.value }
                                  updateNestedContent(["second_section", "points"], newPoints)
                                }}
                                placeholder="Point Title"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`point-desc-${index}`}>Description</Label>
                              <Textarea
                                id={`point-desc-${index}`}
                                value={point.description || ""}
                                onChange={(e) => {
                                  const newPoints = [...sectionContent.second_section.points]
                                  newPoints[index] = { ...newPoints[index], description: e.target.value }
                                  updateNestedContent(["second_section", "points"], newPoints)
                                }}
                                placeholder="Point Description"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )

      case "news":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={sectionContent.heading || ""}
                onChange={(e) => updateNestedContent(["heading"], e.target.value)}
                placeholder="News Heading"
              />
            </div>

            <div className="space-y-2">
              <Label>Latest Blogs</Label>
              <div className="p-4 border rounded-md bg-muted/20">
                <p className="text-sm text-muted-foreground">Latest blogs section is managed automatically.</p>
              </div>
            </div>
          </div>
        )

      case "call_to_action":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mockup">Mockup URL</Label>
              <Input
                id="mockup"
                value={sectionContent.mockup || ""}
                onChange={(e) => updateNestedContent(["mockup"], e.target.value)}
                placeholder="Mockup URL"
              />
              {sectionContent.mockup && (
                <div className="mt-2 p-2 border rounded-md">
                  <Image
                    src={sectionContent.mockup || "/placeholder.svg"}
                    alt="CTA Mockup"
                    width={200}
                    height={150}
                    className="h-24 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={sectionContent.heading || ""}
                onChange={(e) => updateNestedContent(["heading"], e.target.value)}
                placeholder="CTA Heading"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paragraph">Paragraph</Label>
              <Textarea
                id="paragraph"
                value={sectionContent.paragraph || ""}
                onChange={(e) => updateNestedContent(["paragraph"], e.target.value)}
                placeholder="CTA paragraph"
              />
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="buttons">
                <AccordionTrigger>Buttons</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="play-store-url">Play Store URL</Label>
                      <Input
                        id="play-store-url"
                        value={sectionContent.buttons?.play_store_url || ""}
                        onChange={(e) => updateNestedContent(["buttons", "play_store_url"], e.target.value)}
                        placeholder="Play Store URL"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="app-store-url">App Store URL</Label>
                      <Input
                        id="app-store-url"
                        value={sectionContent.buttons?.app_store_url || ""}
                        onChange={(e) => updateNestedContent(["buttons", "app_store_url"], e.target.value)}
                        placeholder="App Store URL"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )

      case "footer":
        return (
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="social_links">
                <AccordionTrigger>Social Links</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {sectionContent.social_links &&
                      Object.entries(sectionContent.social_links).map(([platform, url]: [string, any]) => (
                        <div key={platform} className="space-y-2 border p-3 rounded-md">
                          <h4 className="font-medium">{platform}</h4>
                          <Label htmlFor={`social-${platform}`}>URL</Label>
                          <Input
                            id={`social-${platform}`}
                            value={url}
                            onChange={(e) => {
                              const newSocialLinks = { ...sectionContent.social_links }
                              newSocialLinks[platform] = e.target.value
                              updateNestedContent(["social_links"], newSocialLinks)
                            }}
                            placeholder="https://example.com"
                          />
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )

      // For other sections, display a JSON editor
      default:
        return (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/20">
              <p className="text-sm text-muted-foreground">
                Editing {selectedSection} content. You can modify the JSON directly below.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="raw-content">Content (JSON)</Label>
              <Textarea
                id="raw-content"
                className="font-mono text-xs h-[500px]"
                value={JSON.stringify(sectionContent, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    setSectionContent(parsed)
                  } catch (error) {
                    // Ignore parse errors while typing
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Edit the JSON directly. Be careful to maintain the correct structure.
              </p>
            </div>
          </div>
        )
    }
  }

  // Render preview based on section
  const renderPreview = () => {
    if (!sectionContent) return null

    switch (selectedSection) {
      case "header":
        return (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="h-8 w-24 bg-muted rounded-md flex items-center justify-center">
                {sectionContent.logo ? (
                  <img
                    src={sectionContent.logo || "/placeholder.svg"}
                    alt="Logo"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">Logo</p>
                )}
              </div>
              <div className="hidden md:flex items-center space-x-4">
                {sectionContent.menus?.map((item: string, index: number) => (
                  <div key={index} className="text-sm font-medium">
                    {item}
                  </div>
                ))}
              </div>
              <Button size="sm">{sectionContent.button || "Button"}</Button>
            </div>
          </div>
        )

      case "hero":
        return (
          <div className="border rounded-lg p-6 space-y-4">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{sectionContent.heading || "Heading"}</h2>
              <p className="text-muted-foreground">
                {sectionContent.details || "Details about the product or service."}
              </p>
              <div className="flex space-x-2">
                <Button>{sectionContent.buttons?.[0] || "Button 1"}</Button>
                <Button variant="outline">{sectionContent.buttons?.[1] || "Button 2"}</Button>
              </div>
            </div>
            {sectionContent.images && (
              <div className="grid grid-cols-2 gap-4 mt-6">
                {Object.entries(sectionContent.images)
                  .slice(0, 4)
                  .map(([key, value]: [string, any]) => (
                    <div key={key} className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      {value ? (
                        <img
                          src={(value as string) || "/placeholder.svg"}
                          alt={key}
                          className="h-full w-full object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      ) : (
                        <p className="text-xs text-muted-foreground">{key}</p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="border rounded-lg p-6 flex items-center justify-center h-[300px]">
            <div className="text-center">
              <p className="text-muted-foreground">Preview for {selectedSection} section</p>
              <p className="text-xs text-muted-foreground mt-2">
                This section has a complex structure. Please use the preview tab to see the full rendered content.
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Website Content Editor</CardTitle>
            <CardDescription>Edit your website content with live preview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="section">Select Section</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger id="section">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTION_OPTIONS.filter((option) => availableSections.includes(option.value)).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading content...</span>
                </div>
              ) : (
                renderFormFields()
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleRefresh} disabled={isLoading || isRefreshing}>
                  {isRefreshing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </>
                  )}
                </Button>
                <Button variant="outline" asChild>
                  <a href="/preview" target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Website
                  </a>
                </Button>
                <Button onClick={handleSave} disabled={isLoading || isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>See how your changes will look on the website</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading preview...</span>
            </div>
          ) : (
            renderPreview()
          )}
        </CardContent>
      </Card>
    </div>
  )
}

