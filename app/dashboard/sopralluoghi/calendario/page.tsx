"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import CalendarView from "@/components/dashboard/calendar-view"
import ExplorerBooking from "@/components/dashboard/explorer-booking"

export default function CalendarioPage() {
  const [explorers, setExplorers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedExplorer, setSelectedExplorer] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()

    const { data: explorersData } = await supabase.from("profiles").select("*").eq("role", "esploratore")

    const { data: appointmentsData } = await supabase
      .from("site_visits")
      .select("*, practice_phases(practice_id, practices(title, via))")
      .order("scheduled_at", { ascending: true })

    setExplorers(explorersData || [])
    setAppointments(appointmentsData || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="h-12 w-12 bg-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento calendario...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Calendario Sopralluoghi</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarView appointments={appointments} />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Esploratori</h2>
            <div className="space-y-2">
              {explorers.map((explorer) => (
                <button
                  key={explorer.id}
                  onClick={() => setSelectedExplorer(explorer)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    selectedExplorer?.id === explorer.id ? "bg-indigo-600 text-white" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <p className="font-semibold">{explorer.full_name}</p>
                  <p className="text-sm opacity-75">{explorer.phone}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedExplorer && (
          <ExplorerBooking explorer={selectedExplorer} appointments={appointments} onAppointmentBooked={fetchData} />
        )}
      </div>
    </DashboardLayout>
  )
}
