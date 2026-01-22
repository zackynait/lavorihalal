"use client"

import { useState } from "react"
import { createClientSafe } from "@/lib/supabase/client-safe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CreatePraticaModal({ onClose, onCreated }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    via: "",
    piano: "",
    condominio_name: "",
    condominio_email: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClientSafe()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { error } = await supabase.from("practices").insert([
        {
          title: formData.title,
          description: formData.description,
          via: formData.via,
          piano: formData.piano,
          condominio_name: formData.condominio_name,
          condominio_email: formData.condominio_email,
          created_by: user.id,
          status: "open",
        },
      ])

      if (error) {
        console.error("[v0] RLS Policy Error:", error)
        throw error
      }

      onCreated()
    } catch (error) {
      console.error("Error creating pratica:", error)
      alert("Errore nella creazione della pratica: " + (error?.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Nuova Pratica</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Titolo"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="col-span-2"
            />

            <Textarea
              placeholder="Descrizione"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="col-span-2"
            />

            <Input
              type="text"
              placeholder="Via"
              value={formData.via}
              onChange={(e) => setFormData({ ...formData, via: e.target.value })}
              required
              className="col-span-2"
            />

            <Input
              type="text"
              placeholder="Piano"
              value={formData.piano}
              onChange={(e) => setFormData({ ...formData, piano: e.target.value })}
            />

            <Input
              type="text"
              placeholder="Nome Condòmino"
              value={formData.condominio_name}
              onChange={(e) => setFormData({ ...formData, condominio_name: e.target.value })}
            />

            <Input
              type="email"
              placeholder="Email Condòmino"
              value={formData.condominio_email}
              onChange={(e) => setFormData({ ...formData, condominio_email: e.target.value })}
              className="col-span-2"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" onClick={onClose} variant="outline">
              Annulla
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creazione..." : "Crea Pratica"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
