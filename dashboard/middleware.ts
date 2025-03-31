import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/forgot-password" || path === "/admin-setup" || path === "/"

  // Define role-specific paths
  const isAdminPath = path.startsWith("/admin")
  const isEditorPath = path.startsWith("/editor")
  const isSeoPath = path.startsWith("/seo")

  // Check if the user is authenticated
  const authToken = request.cookies.get("auth-token")?.value
  const userRole = request.cookies.get("user-role")?.value

  // If the user is not authenticated and trying to access a protected route, redirect to login
  if (!authToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is authenticated and trying to access login page, redirect to appropriate dashboard
  if (authToken && path === "/login") {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    } else if (userRole === "editor") {
      return NextResponse.redirect(new URL("/editor/dashboard", request.url))
    } else if (userRole === "seo") {
      return NextResponse.redirect(new URL("/seo/dashboard", request.url))
    }
  }

  // Role-based access control
  if (authToken) {
    // Admin can access all paths
    if (userRole === "admin") {
      return NextResponse.next()
    }

    // Editor can only access content paths and public paths
    if (userRole === "editor" && (isEditorPath || isPublicPath)) {
      return NextResponse.next()
    }

    // SEO can only access SEO paths and public paths
    if (userRole === "seo" && (isSeoPath || isPublicPath)) {
      return NextResponse.next()
    }

    // Redirect to appropriate dashboard if trying to access unauthorized path
    if (userRole === "editor") {
      return NextResponse.redirect(new URL("/editor/dashboard", request.url))
    } else if (userRole === "seo") {
      return NextResponse.redirect(new URL("/seo/dashboard", request.url))
    }
  }

  // Otherwise, continue with the request
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|preview).*)"],
}

