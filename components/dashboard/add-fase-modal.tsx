"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function AddFaseModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "altro",
    urgency: false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      urgency: formData.urgency,
      status: "pending",
    })
    setFormData({ title: "", description: "", type: "altro", urgency: false })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Nuova Fase</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            type="text"
            placeholder="Nome fase (es: Imbiancatura)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            placeholder="Descrizione"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="imbiancatura">Imbiancatura</option>
            <option value="idraulica">Idraulica</option>
            <option value="elettrica">Elettrica</option>
            <option value="strutturale">Strutturale</option>
            <option value="sopralluogo">Sopralluogo</option>
            <option value="altro">Altro</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-gray-700">Fase urgente</span>
          </label>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" onClick={onClose} variant="outline">
              Annulla
            </Button>
            <Button type="submit">Aggiungi Fase</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
