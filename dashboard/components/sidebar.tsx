"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Edit, Users, FileText, LogOut, Menu, X, Moon, Sun, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

// Navigation items for different roles
const navigationItems = {
  admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Blogs", href: "/admin/blogs", icon: Edit },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Content", href: "/admin/content", icon: FileText },
    { name: "Image Gallery", href: "/admin/image-gallery", icon: Image },
  ],
  "blog-writer": [
    { name: "Dashboard", href: "/blog/dashboard", icon: LayoutDashboard },
    { name: "My Posts", href: "/blog/posts", icon: FileText },
    { name: "Create Post", href: "/blog/create", icon: Edit },
  ],
  editor: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Content", href: "/content", icon: FileText },
    { name: "Image Gallery", href: "/image-gallery", icon: Image },
  ],
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  // Get navigation items based on user role
  const userRole = user?.role || "admin"
  const navigation = navigationItems[userRole as keyof typeof navigationItems] || navigationItems.admin

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
            <p className="text-sm text-muted-foreground capitalize">{userRole} Dashboard</p>
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
            <p className="text-sm text-muted-foreground capitalize">{userRole} Dashboard</p>
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

