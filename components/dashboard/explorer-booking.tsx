"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ExplorerBooking({ explorer, appointments, onAppointmentBooked }) {
  const [showBooking, setShowBooking] = useState(false)
  const [formData, setFormData] = useState({
    practice_id: "",
    scheduled_date: "",
    scheduled_time: "09:00",
  })
  const [loading, setLoading] = useState(false)

  const explorerAppointments = appointments.filter((apt) => apt.explorer_id === explorer.id)
  const isAvailable = explorerAppointments.length < 5

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const scheduledDateTime = `${formData.scheduled_date}T${formData.scheduled_time}:00`

      await supabase.from("site_visits").insert([
        {
          practice_id: formData.practice_id,
          explorer_id: explorer.id,
          scheduled_at: scheduledDateTime,
        },
      ])

      alert("Appuntamento prenotato con successo!")
      setFormData({ practice_id: "", scheduled_date: "", scheduled_time: "09:00" })
      setShowBooking(false)
      onAppointmentBooked()
    } catch (error) {
      console.error("Error booking appointment:", error)
      alert("Errore nella prenotazione")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{explorer.full_name} - Appuntamenti</h2>
        <button
          onClick={() => setShowBooking(!showBooking)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {showBooking ? "Annulla" : "+ Aggiungi Appuntamento"}
        </button>
      </div>

      {showBooking && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
          <input
            type="text"
            placeholder="ID Pratica"
            value={formData.practice_id}
            onChange={(e) => setFormData({ ...formData, practice_id: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="date"
            value={formData.scheduled_date}
            onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="time"
            value={formData.scheduled_time}
            onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Prenotazione in corso..." : "Prenota Appuntamento"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Appuntamenti prossimi:</h3>
        {explorerAppointments.length === 0 ? (
          <p className="text-gray-500">Nessun appuntamento</p>
        ) : (
          explorerAppointments.map((apt) => (
            <div key={apt.id} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="font-semibold text-gray-900">{apt.practices?.title}</p>
              <p className="text-sm text-gray-600">{apt.via}</p>
              <p className="text-sm text-indigo-600 mt-1">{new Date(apt.scheduled_at).toLocaleString("it-IT")}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
