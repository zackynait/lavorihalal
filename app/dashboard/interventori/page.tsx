"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"

export default function InterventoriPage() {
  const [interventori, setInterventori] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInterventori()
  }, [])

  const fetchInterventori = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("profiles").select("*").eq("role", "interventore")

    const interventoriWithTasks = await Promise.all(
      (data || []).map(async (int) => {
        const { data: tasks } = await supabase
          .from("practice_phases")
          .select("*, practices(title)")
          .eq("assigned_to", int.id)
          .neq("status", "completed")

        return { ...int, tasks: tasks || [] }
      }),
    )

    setInterventori(interventoriWithTasks)
    setLoading(false)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="h-12 w-12 bg-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento interventori...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestione Interventori</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interventori.map((int) => (
            <div key={int.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{int.full_name}</h2>
              <p className="text-gray-600 text-sm mb-4">{int.phone}</p>

              <div className="mb-4">
                <p className="font-semibold text-gray-900 mb-2">Incarichi assegnati: {int.tasks.length}</p>
                {int.tasks.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nessun incarico assegnato</p>
                ) : (
                  <ul className="space-y-2">
                    {int.tasks.map((task) => (
                      <li key={task.id} className="text-sm bg-blue-50 rounded p-2">
                        <p className="font-semibold text-gray-900">{task.title}</p>
                        <p className="text-gray-600">{task.practices?.title}</p>
                        {task.urgency && (
                          <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                            Urgente
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {int.availability_start && (
                <div className="text-sm text-gray-600 border-t pt-4">
                  <p className="font-semibold">Disponibilità:</p>
                  <p>
                    {int.availability_start} - {int.availability_end}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
