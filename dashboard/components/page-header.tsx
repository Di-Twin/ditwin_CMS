import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  children?: ReactNode
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between py-4 md:py-6">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}

