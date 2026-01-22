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

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!envReady) {
      setError("Le variabili di ambiente non sono configurate.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClientSafe()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/dashboard")
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
              <CardTitle className="text-2xl">Accedi</CardTitle>
              <CardDescription>Accedi al tuo account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
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
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={!envReady || isLoading}>
                    {isLoading ? "Accesso in corso..." : "Accedi"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Non hai un account?{" "}
                  <Link href="/auth/sign-up" className="underline underline-offset-4">
                    Registrati
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
