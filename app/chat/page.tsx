import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"

export default async function ChatPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const { data: conversations } = await supabase
    .from("conversations")
    .select(`
      *,
      jobs (title, sector),
      participant1:participant1_id (id, full_name),
      participant2:participant2_id (id, full_name)
    `)
    .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
    .order("updated_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna alla Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Messaggi</h1>

        {conversations && conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((conv) => {
              const otherUser = conv.participant1?.id === user.id 
                ? conv.participant2 
                : conv.participant1
              
              return (
                <Link key={conv.id} href={`/chat/${conv.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-border">
                    <CardContent className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-semibold text-lg">
                            {otherUser?.full_name?.[0] || "?"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground truncate">
                              {otherUser?.full_name || "Utente"}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            Re: {conv.jobs?.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {conv.jobs?.sector}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {new Date(conv.updated_at).toLocaleDateString("it-IT")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-card-foreground mb-2">Nessun messaggio</h3>
              <p className="text-muted-foreground">
                Quando contatterai qualcuno per un annuncio, la conversazione apparirà qui.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
