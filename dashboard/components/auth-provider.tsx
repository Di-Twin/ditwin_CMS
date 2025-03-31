"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type User = {
  role: string
  token: string
}

type AuthContextType = {
  user: User | null
  login: (token: string, role: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    if (token && role) {
      setUser({ token, role })
    }

    setIsLoading(false)
  }, [])

  // Update the login function
  const login = (token: string, role: string) => {
    // Update state
    setUser({ token, role })

    // Store in localStorage
    localStorage.setItem("token", token)
    localStorage.setItem("role", role)

    // Set cookies for middleware
    document.cookie = `auth-token=${token}; path=/; max-age=3600` // 1 hour to match backend
    document.cookie = `user-role=${role}; path=/; max-age=3600` // 1 hour to match backend

    // Show success message
    toast({
      title: "Login successful",
      description: `Welcome to DI-Twin CMS Dashboard (${role})`,
    })

    // Redirect based on role
    switch (role) {
      case "admin":
        router.push("/admin/dashboard")
        break
      case "editor":
        router.push("/editor/dashboard")
        break
      case "seo":
        router.push("/seo/dashboard")
        break
      default:
        router.push("/")
    }
  }

  const logout = () => {
    // Clear state
    setUser(null)

    // Clear localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("role")

    // Clear cookies
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

    // Redirect to login
    router.push("/login")

    // Show logout message
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

