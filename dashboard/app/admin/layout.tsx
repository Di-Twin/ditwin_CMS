import type React from "react"
import { Sidebar } from "@/components/sidebar"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

