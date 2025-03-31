"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Eye, Trash, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getAllBlogs, deleteBlog } from "@/services/blog-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Blog = {
  id: string
  heading: string
  date: string
  main_tag: string
  tags: string[]
  content: string
  image: string
  image_alt: string
}

export function BlogTable() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)

  const fetchBlogs = async () => {
    setIsLoading(true)
    try {
      const data = await getAllBlogs()
      setBlogs(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load blogs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
    // Get user role from localStorage
    setUserRole(localStorage.getItem("role"))
  }, [])

  const handleView = (id: string) => {
    router.push(`/admin/blogs/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/blogs/edit/${id}`)
  }

  const handleDelete = async () => {
    if (!blogToDelete) return

    setIsDeleting(true)
    try {
      await deleteBlog(blogToDelete)
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      })
      fetchBlogs() // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setBlogToDelete(null)
    }
  }

  const confirmDelete = (id: string) => {
    setBlogToDelete(id)
    setDeleteDialogOpen(true)
  }

  const columns: ColumnDef<Blog>[] = [
    {
      accessorKey: "heading",
      header: "Title",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: "main_tag",
      header: "Category",
      cell: ({ row }) => {
        const tag = row.getValue("main_tag") as string
        return <Badge variant="secondary">{tag}</Badge>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const blog = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleView(blog.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(blog.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {userRole === "admin" && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => confirmDelete(blog.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: blogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No blog posts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

