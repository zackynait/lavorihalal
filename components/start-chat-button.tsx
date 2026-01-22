"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageCircle, Loader2 } from "lucide-react"

interface StartChatButtonProps {
  jobId: string
  jobOwnerId: string
  jobTitle: string
  variant?: "default" | "secondary" | "outline"
}

export function StartChatButton({ jobId, jobOwnerId, jobTitle, variant = "default" }: StartChatButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleStartChat = async () => {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Check if conversation already exists
    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id")
      .eq("job_id", jobId)
      .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${jobOwnerId}),and(participant1_id.eq.${jobOwnerId},participant2_id.eq.${user.id})`)
      .single()

    if (existingConv) {
      router.push(`/chat/${existingConv.id}`)
      return
    }

    // Create new conversation
    const { data: newConv, error } = await supabase
      .from("conversations")
      .insert({
        job_id: jobId,
        participant1_id: user.id,
        participant2_id: jobOwnerId,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating conversation:", error)
      setLoading(false)
      return
    }

    router.push(`/chat/${newConv.id}`)
  }

  return (
    <Button onClick={handleStartChat} disabled={loading} variant={variant}>
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <MessageCircle className="w-4 h-4 mr-2" />
      )}
      Contatta
    </Button>
  )
}
