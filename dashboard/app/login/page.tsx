import LoginForm from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Welcome to DTwin CMS</h1>
          <p className="text-muted-foreground mt-2">Login to access your dashboard and manage your website content</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

