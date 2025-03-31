import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, newPassword } = body

    if (!email || !newPassword) {
      return NextResponse.json({ error: "Email and new password are required" }, { status: 400 })
    }

    // Forward the request to the backend API
    const response = await fetch(
      `${process.env.BACKEND_API_URL || "https://dtwin-cms-api.evenbetter.in"}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error || "Failed to reset password" }, { status: response.status })
    }

    return NextResponse.json({ message: data.message || "Password reset successful" })
  } catch (error: any) {
    console.error("Error resetting password:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

