import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Briefcase } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Lavori Halal</span>
          </Link>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl text-card-foreground">Controlla la tua email</CardTitle>
            <CardDescription>
              Ti abbiamo inviato un link di conferma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground text-sm">
              Clicca sul link che ti abbiamo inviato per verificare il tuo account e completare la registrazione.
            </p>
            <p className="text-center text-muted-foreground text-sm">
              Non hai ricevuto l&apos;email? Controlla la cartella spam.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/login">Torna al Login</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/">Torna alla Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
