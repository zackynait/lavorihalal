"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import InterventoreDailyPlan from "@/components/dashboard/interventore-daily-plan"

export default function InterventoreDashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [todayTasks, setTodayTasks] = useState([])
  const [completedToday, setCompletedToday] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      setProfile(profileData)

      const { data: tasks } = await supabase
        .from("practice_phases")
        .select("*, practices(title, via)")
        .eq("assigned_to", user.id)

      setTodayTasks(tasks || [])

      const { data: completed } = await supabase
        .from("practice_phases")
        .select("*", { count: "exact" })
        .eq("assigned_to", user.id)
        .eq("status", "completed")

      setCompletedToday(completed?.length || 0)
    }

    setLoading(false)
  }

  const markTaskComplete = async (taskId) => {
    const supabase = createClient()
    await supabase.from("practice_phases").update({ status: "completed" }).eq("id", taskId)

    setTodayTasks(todayTasks.filter((t) => t.id !== taskId))
    setCompletedToday(completedToday + 1)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="h-12 w-12 bg-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Incarichi Totali</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">{todayTasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Completati Oggi</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{completedToday}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">In Sospeso</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {todayTasks.filter((t) => t.status !== "completed").length}
            </p>
          </div>
        </div>

        <InterventoreDailyPlan interventoreId={user?.id} />

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Incarichi</h2>

          {todayTasks.length === 0 ? (
            <p className="text-gray-500">Nessun incarico assegnato</p>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <input type="checkbox" onChange={() => markTaskComplete(task.id)} className="mt-1 w-5 h-5 rounded" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.practices?.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{task.practices?.via}</p>
                    {task.urgency && (
                      <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                        Urgente
                      </span>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
