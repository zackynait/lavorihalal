"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function InterventoreDailyPlan({ interventoreId }) {
  const [todayTasks, setTodayTasks] = useState([])
  const [optimizedRoute, setOptimizedRoute] = useState([])
  const [totalDistance, setTotalDistance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodayTasks()
  }, [interventoreId])

  const fetchTodayTasks = async () => {
    const supabase = createClient()

    const { data } = await supabase
      .from("practice_phases")
      .select("*, practices(via, piano)")
      .eq("assigned_to", interventoreId)
      .neq("status", "completed")

    if (data && data.length > 0) {
      await optimizeRoute(data)
    }

    setTodayTasks(data || [])
    setLoading(false)
  }

  const optimizeRoute = async (tasks: any[]) => {
    try {
      const { data: profile } = await createClient()
        .from("profiles")
        .select("latitude, longitude")
        .eq("id", interventoreId)
        .single()

      const locations = tasks.map((task) => ({
        id: task.id,
        lat: task.practices?.latitude || 0,
        lng: task.practices?.longitude || 0,
        name: task.title,
        urgency: task.urgency,
      }))

      const home = {
        id: "home",
        lat: profile?.latitude || 0,
        lng: profile?.longitude || 0,
        name: "Casa",
        urgency: false,
      }

      const response = await fetch("/api/routing/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ home, locations }),
      })

      const { optimized, totalDistance } = await response.json()
      setOptimizedRoute(optimized)
      setTotalDistance(totalDistance)
    } catch (error) {
      console.error("Error optimizing route:", error)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Caricamento...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Piano Giornaliero</h2>
        <p className="text-gray-600">Distanza totale: {totalDistance} km</p>
      </div>

      <div className="space-y-3">
        {optimizedRoute.map((task, index) => (
          <div key={task.id} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{task.name}</p>
              {task.urgency && (
                <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                  Urgente
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
