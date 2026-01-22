"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import AddFaseModal from "./add-fase-modal"

export default function FasiSection({ praticaId, fasi: initialFasi }) {
  const [fasi, setFasi] = useState(initialFasi)
  const [showAddModal, setShowAddModal] = useState(false)
  const [interventori, setInterventori] = useState([])

  useEffect(() => {
    fetchInterventori()
  }, [])

  const fetchInterventori = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("profiles").select("*").eq("role", "interventore")
    setInterventori(data || [])
  }

  const handleAddFase = async (newFase) => {
    const supabase = createClient()
    const { data } = await supabase
      .from("practice_phases")
      .insert([{ ...newFase, practice_id: praticaId }])
      .select()

    setFasi([...fasi, data[0]])
    setShowAddModal(false)
  }

  const handleAssignFase = async (faseId, interventoreId) => {
    const supabase = createClient()
    await supabase.from("practice_phases").update({ assigned_to: interventoreId }).eq("id", faseId)

    setFasi(fasi.map((f) => (f.id === faseId ? { ...f, assigned_to: interventoreId } : f)))
  }

  const handleToggleUrgency = async (faseId, currentUrgency) => {
    const supabase = createClient()
    await supabase.from("practice_phases").update({ urgency: !currentUrgency }).eq("id", faseId)

    setFasi(fasi.map((f) => (f.id === faseId ? { ...f, urgency: !currentUrgency } : f)))
  }

  const handleUpdateFase = async (faseId, updates) => {
    const supabase = createClient()
    await supabase.from("practice_phases").update(updates).eq("id", faseId)

    setFasi(fasi.map((f) => (f.id === faseId ? { ...f, ...updates } : f)))
  }

  const handleDeleteFase = async (faseId) => {
    const supabase = createClient()
    await supabase.from("practice_phases").delete().eq("id", faseId)
    setFasi(fasi.filter((f) => f.id !== faseId))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Fasi Lavoro</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          + Aggiungi Fase
        </button>
      </div>

      <div className="space-y-4">
        {fasi.length === 0 ? (
          <p className="text-gray-500 py-4">Nessuna fase aggiunta. Clicca il bottone per aggiungerla.</p>
        ) : (
          fasi.map((fase) => (
            <div key={fase.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{fase.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{fase.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleUrgency(fase.id, fase.urgency)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      fase.urgency
                        ? "bg-red-200 text-red-800 hover:bg-red-300"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {fase.urgency ? "Urgente" : "Normale"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    fase.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : fase.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {fase.status}
                </span>
              </div>

              <div className="mb-3">
                <label className="text-xs font-semibold text-gray-600">Assegna a:</label>
                <select
                  value={fase.assigned_to || ""}
                  onChange={(e) => handleAssignFase(fase.id, e.target.value || null)}
                  className="w-full mt-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Non assegnato</option>
                  {interventori.map((int) => (
                    <option key={int.id} value={int.id}>
                      {int.full_name} {int.phone && `(${int.phone})`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateFase(fase.id, { status: "completed" })}
                  className="text-green-600 hover:text-green-900 font-semibold text-sm"
                >
                  Completa
                </button>
                <button
                  onClick={() => handleDeleteFase(fase.id)}
                  className="text-red-600 hover:text-red-900 font-semibold text-sm"
                >
                  Elimina
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && <AddFaseModal onClose={() => setShowAddModal(false)} onAdd={handleAddFase} />}
    </div>
  )
}
