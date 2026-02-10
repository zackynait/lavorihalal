import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"
import { UserNav } from "./user-nav"

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Lavori Halal</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">
            Annunci
          </Link>
          <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </Link>
          {user && (
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/jobs/new" className="hidden sm:block">
                <Button size="sm">Pubblica</Button>
              </Link>
              <UserNav user={user} />
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Accedi</Button>
              </Link>
              <Link href="/auth/sign-up" className="hidden sm:block">
                <Button size="sm">Registrati</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
