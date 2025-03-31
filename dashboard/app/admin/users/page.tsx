import { UserTable } from "@/components/dashboard/user-table"
import { AddUserForm } from "@/components/dashboard/add-user-form"
import { PageHeader } from "@/components/page-header"

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <PageHeader title="User Management">
        <AddUserForm />
      </PageHeader>

      <UserTable />
    </div>
  )
}

