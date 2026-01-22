"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export default function InvoiceGenerator({ onInvoiceCreated }) {
  const [showModal, setShowModal] = useState(false)
  const [practices, setPractices] = useState([])
  const [selectedPractice, setSelectedPractice] = useState("")
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    due_date: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPractices()
  }, [])

  const fetchPractices = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("practices").select("id, title, description").eq("status", "completed")

    setPractices(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const invoiceNumber = `INV-${Date.now()}`

      const selectedPracticeData = practices.find((p) => p.id === selectedPractice)
      const description = formData.description || selectedPracticeData?.description || "Servizi di pronto intervento"

      await supabase.from("invoices").insert([
        {
          practice_id: selectedPractice,
          invoice_number: invoiceNumber,
          description: description,
          amount: Number.parseFloat(formData.amount),
          status: "draft",
          paid_at: null,
        },
      ])

      alert("Fattura creata con successo!")
      setShowModal(false)
      setFormData({ description: "", amount: "", due_date: "" })
      onInvoiceCreated()
    } catch (error) {
      console.error("Error creating invoice:", error)
      alert("Errore nella creazione della fattura")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setShowModal(true)} className="bg-green-600 hover:bg-green-700">
        + Nuova Fattura
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Nuova Fattura</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Pratica</label>
                <select
                  value={selectedPractice}
                  onChange={(e) => setSelectedPractice(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleziona pratica</option>
                  {practices.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Descrizione servizi"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="number"
                placeholder="Importo (€)"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                step="0.01"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" onClick={() => setShowModal(false)} variant="outline">
                  Annulla
                </Button>
                <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                  {loading ? "Creazione..." : "Crea Fattura"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
