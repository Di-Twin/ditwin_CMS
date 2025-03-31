"use client"

import { useState, useEffect } from "react"
import { getAllContent } from "@/services/content-service"
import { Loader2 } from "lucide-react"
import "./preview.css" // Import custom CSS for preview

export default function PreviewPage() {
  const [content, setContent] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAllContent() {
      try {
        const data = await getAllContent()

        // Convert array to object with section as key
        const contentMap: Record<string, any> = {}

        // Handle empty data case
        if (!data || data.length === 0) {
          setContent({})
          setIsLoading(false)
          return
        }

        data.forEach((item: any) => {
          if (item && item.section) {
            contentMap[item.section] = item.content
          }
        })

        setContent(contentMap)
      } catch (error) {
        console.error("Error fetching content:", error)
        // Set empty content on error
        setContent({})
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllContent()
  }, [])

  if (isLoading) {
    return (
      <div className="preview-loading">
        <Loader2 className="preview-spinner" />
        <span>Loading preview...</span>
      </div>
    )
  }

  return (
    <div className="preview-container">
      {/* Header Section */}
      <header className="preview-header">
        <div className="preview-header-content">
          <div className="preview-logo">
            {content.header?.logo ? (
              <img src={content.header.logo || "/placeholder.svg"} alt="Logo" />
            ) : (
              <span>DTwin</span>
            )}
          </div>
          <nav className="preview-nav">
            {content.header?.menus?.map((item: string, index: number) => (
              <a key={index} href="#" className="preview-nav-item">
                {item}
              </a>
            ))}
          </nav>
          <a href={content.header?.button_url || "#"} className="preview-button">
            {content.header?.button || "Get Started"}
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="preview-hero">
        <div className="preview-hero-content">
          <h1 className="preview-hero-title">{content.hero?.heading || "Hero Heading"}</h1>
          <p className="preview-hero-description">{content.hero?.details || "Hero details go here."}</p>
          <div className="preview-hero-buttons">
            {content.hero?.buttons?.map((button: string, index: number) => (
              <a
                key={index}
                href={content.hero?.button_url?.[index] || "#"}
                className={`preview-button ${index === 0 ? "preview-button-primary" : "preview-button-secondary"}`}
              >
                {button}
              </a>
            ))}
          </div>
        </div>
        <div className="preview-hero-images">
          {content.hero?.images &&
            Object.entries(content.hero.images).map(([key, url]: [string, any]) => (
              <div key={key} className="preview-hero-image-container">
                <img
                  src={(url as string) || "/placeholder.svg"}
                  alt={key}
                  className="preview-hero-image"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>
            ))}
        </div>
      </section>

      {/* Supported Integrations */}
      {content.supported_integrations && (
        <section className="preview-integrations">
          <p className="preview-integrations-description">
            {content.supported_integrations.description || "Supported integrations description."}
          </p>
          <div className="preview-integrations-logos">
            {content.supported_integrations.logos?.map((logo: string, index: number) => (
              <div key={index} className="preview-integration-logo">
                <img
                  src={logo || "/placeholder.svg"}
                  alt={`Integration ${index + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      {content.features_one?.top_section && (
        <section className="preview-features">
          <div className="preview-features-content">
            <div className="preview-features-text">
              <h2 className="preview-features-title">{content.features_one.top_section.heading}</h2>
              <p className="preview-features-description">{content.features_one.top_section.paragraph}</p>
              <div className="preview-features-points">
                {content.features_one.top_section.bullet_points?.map((point: any, index: number) => (
                  <div key={index} className="preview-feature-point">
                    <div className="preview-feature-point-number">{index + 1}</div>
                    <div className="preview-feature-point-content">
                      <h3 className="preview-feature-point-title">{point.title}</h3>
                      <p className="preview-feature-point-description">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="preview-features-images">
              {content.features_one.images?.mockup1 && (
                <img
                  src={content.features_one.images.mockup1 || "/placeholder.svg"}
                  alt="Feature mockup"
                  className="preview-features-mockup"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              )}
              {content.features_one.images?.floating_card1 && (
                <img
                  src={content.features_one.images.floating_card1 || "/placeholder.svg"}
                  alt="Feature card"
                  className="preview-features-floating-card"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="preview-footer">
        <div className="preview-footer-content">
          <div className="preview-footer-info">
            <div className="preview-footer-logo">Company Name</div>
            <p className="preview-footer-tagline">Your personal health assistant</p>
          </div>

          <div className="preview-footer-links">
            <div className="preview-footer-column">
              <h3 className="preview-footer-heading">Quick Links</h3>
              <ul className="preview-footer-list">
                {content.header?.menus?.slice(0, 4).map((item: string, index: number) => (
                  <li key={index}>
                    <a href="#" className="preview-footer-link">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="preview-footer-column">
              <h3 className="preview-footer-heading">Legal</h3>
              <ul className="preview-footer-list">
                <li>
                  <a href="#" className="preview-footer-link">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="preview-footer-link">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div className="preview-footer-column">
              <h3 className="preview-footer-heading">Connect</h3>
              <div className="preview-footer-social">
                {content.footer?.social_links &&
                  Object.entries(content.footer.social_links).map(([platform, url]: [string, any]) => (
                    <a key={platform} href={url as string} className="preview-footer-social-link">
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="preview-footer-copyright">© {new Date().getFullYear()} Company Name. All rights reserved.</div>
      </footer>
    </div>
  )
}

