"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Trash2, Loader2 } from "lucide-react"

interface DeleteJobButtonProps {
  jobId: string
}

export function DeleteJobButton({ jobId }: DeleteJobButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm("Sei sicuro di voler eliminare questo annuncio?")) return

    setLoading(true)

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId)

    if (error) {
      console.error("Error deleting job:", error)
      alert("Errore durante l'eliminazione")
    } else {
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <DropdownMenuItem onClick={handleDelete} disabled={loading} className="text-destructive">
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4 mr-2" />
      )}
      Elimina
    </DropdownMenuItem>
  )
}
