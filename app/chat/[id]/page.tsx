import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Briefcase } from "lucide-react"
import { Header } from "@/components/header"
import { ChatMessages } from "@/components/chat-messages"

interface ChatDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ChatDetailPage({ params }: ChatDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const { data: conversation, error } = await supabase
    .from("conversations")
    .select(`
      *,
      jobs (id, title, sector, is_piva),
      participant1:participant1_id (id, full_name),
      participant2:participant2_id (id, full_name)
    `)
    .eq("id", id)
    .single()

  if (error || !conversation) {
    notFound()
  }

  // Check if user is part of the conversation
  if (conversation.participant1_id !== user.id && conversation.participant2_id !== user.id) {
    notFound()
  }

  const otherUser = conversation.participant1?.id === user.id 
    ? conversation.participant2 
    : conversation.participant1

  // Fetch messages
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      *,
      sender:sender_id (id, full_name)
    `)
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto">
        {/* Chat Header */}
        <div className="sticky top-0 z-40 bg-card border-b border-border px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/chat" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {otherUser?.full_name?.[0] || "?"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground truncate">
                {otherUser?.full_name || "Utente"}
              </h2>
              <Link href={`/jobs/${conversation.jobs?.id}`} className="text-sm text-muted-foreground hover:text-primary truncate flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {conversation.jobs?.title}
              </Link>
            </div>
            <Badge variant={conversation.jobs?.is_piva ? "outline" : "secondary"}>
              {conversation.jobs?.is_piva ? "P.IVA" : "Dipendente"}
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <ChatMessages 
          conversationId={id} 
          currentUserId={user.id}
          initialMessages={messages || []}
        />
      </main>
    </div>
  )
}
