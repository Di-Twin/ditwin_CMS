"use client"

import { useState, useEffect } from "react"
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
import { MoreHorizontal, Pencil, Trash, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
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
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

type User = {
  id: string
  email: string
  role: "admin" | "editor" | "seo"
  created_at: string
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  // Fetch users from the backend
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch("https://dtwin-cms-api.evenbetter.in/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to fetch users: ${response.statusText}`)
      }

      const data = await response.json()
      setUsers(data.users || [])
    } catch (error: any) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load users",
        variant: "destructive",
      })
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle user deletion
  const confirmDelete = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedUser) return

    setIsDeleting(true)
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`https://dtwin-cms-api.evenbetter.in/auth/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete user")
      }

      toast({
        title: "Success",
        description: "User deleted successfully",
      })

      // Refresh the user list
      fetchUsers()
    } catch (error: any) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setSelectedUser(null)
    }
  }

  // Handle password reset
  const openResetPassword = (user: User) => {
    setSelectedUser(user)
    setResetPasswordOpen(true)
  }

  const handleResetSuccess = () => {
    setResetPasswordOpen(false)
    setSelectedUser(null)
    toast({
      title: "Success",
      description: "Password reset successfully",
    })
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return (
          <Badge variant={role === "admin" ? "default" : role === "editor" ? "secondary" : "outline"}>
            {role === "admin" ? "Admin" : role === "editor" ? "Content Editor" : "SEO Specialist"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

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
              <DropdownMenuItem onClick={() => openResetPassword(user)}>
                <Pencil className="mr-2 h-4 w-4" />
                Reset Password
              </DropdownMenuItem>
              {user.role !== "admin" && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => confirmDelete(user)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete User
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: users,
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
                  No users found.
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

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account.
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

      {/* Reset Password Dialog */}
      {selectedUser && (
        <ResetPasswordForm
          email={selectedUser.email}
          onSuccess={handleResetSuccess}
          isOpen={resetPasswordOpen}
          onOpenChange={setResetPasswordOpen}
        />
      )}
    </>
  )
}

