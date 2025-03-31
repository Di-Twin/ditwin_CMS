import { UserTable } from "@/components/dashboard/user-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <PageHeader title="User Management">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </PageHeader>

      <UserTable />
    </div>
  )
}

