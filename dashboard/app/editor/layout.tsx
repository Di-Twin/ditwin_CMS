import type React from "react"
import { EditorSidebar } from "@/components/editor/editor-sidebar"

export default function EditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen">
      <EditorSidebar />
      <div className="flex-1 md:ml-64">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

