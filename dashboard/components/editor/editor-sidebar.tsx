"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, LogOut, Menu, X, Moon, Sun, Image, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

export function EditorSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()

  // Navigation items for content editor
  const navigation = [
    { name: "Dashboard", href: "/editor/dashboard", icon: LayoutDashboard },
    { name: "Blog Posts", href: "/editor/blogs", icon: FileText },
    { name: "New Blog Post", href: "/editor/blogs/new", icon: Plus },
    { name: "Image Gallery", href: "/editor/image-gallery", icon: Image },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-30 transform bg-background transition-transform duration-200 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto bg-background py-6 shadow-lg">
          <div className="px-4 py-2 mb-8">
            <h1 className="text-2xl font-bold">DTwin CMS</h1>
            <p className="text-sm text-muted-foreground">Content Editor Dashboard</p>
          </div>
          <nav className="flex-1 space-y-1 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="px-4 mt-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Dark Mode</span>
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
            <Button variant="outline" className="w-full justify-start" onClick={logout}>
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex flex-col flex-grow border-r bg-background pt-5 h-full">
          <div className="px-4 py-2 mb-8">
            <h1 className="text-2xl font-bold">DTwin CMS</h1>
            <p className="text-sm text-muted-foreground">Content Editor Dashboard</p>
          </div>
          <nav className="flex-1 space-y-1 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="px-4 mt-auto space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Dark Mode</span>
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
            <Button variant="outline" className="w-full justify-start" onClick={logout}>
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

