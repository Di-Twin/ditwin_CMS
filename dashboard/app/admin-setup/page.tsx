"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSignupForm } from "@/components/auth/admin-signup-form"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

export default function AdminSetupPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [adminExists, setAdminExists] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Check if admin already exists
    const checkAdminExists = async () => {
      try {
        const response = await fetch("/api/users/check-admin-exists")
        const data = await response.json()

        setAdminExists(data.exists)

        // If admin exists and user is not logged in, redirect to login
        if (data.exists && !user) {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error checking if admin exists:", error)
        // Default to showing the form if we can't check
        setAdminExists(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminExists()
  }, [router, user])

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    if (user && user.role === "admin") {
      router.push("/admin/dashboard")
    }
  }, [user, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (adminExists) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Already Exists</h1>
          <p className="mb-6">An admin account has already been created. Please log in instead.</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">DTwin CMS Setup</h1>
          <p className="text-muted-foreground mt-2">Create your admin account to get started</p>
        </div>
        <AdminSignupForm />
      </div>
    </div>
  )
}

