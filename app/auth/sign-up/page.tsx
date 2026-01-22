"use client"

import type React from "react"
import { createClientSafe, isSupabaseConfigured } from "@/lib/supabase/client-safe"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { USER_ROLES, roleDisplayNames } from "@/lib/utils/roles"

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState<string>(USER_ROLES.CONDOMINO)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [envReady, setEnvReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isSupabaseConfigured()) {
      setEnvReady(true)
    } else {
      setError("Configurazione Supabase mancante. Verifica le variabili di ambiente nel pannello Vars.")
    }
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!envReady) {
      setError("Le variabili di ambiente non sono configurate.")
      return
    }

    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Le password non corrispondono")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClientSafe()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Si è verificato un errore")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Registrazione</CardTitle>
              <CardDescription>Crea un nuovo account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Mario Rossi"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!envReady || isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!envReady || isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Ruolo</Label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled={!envReady || isLoading}
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {Object.entries(USER_ROLES).map(([key, value]) => (
                        <option key={value} value={value}>
                          {roleDisplayNames[value as keyof typeof roleDisplayNames]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={!envReady || isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Ripeti Password</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      disabled={!envReady || isLoading}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={!envReady || isLoading}>
                    {isLoading ? "Registrazione in corso..." : "Registrati"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Hai già un account?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    Accedi
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
