"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import PraticheList from "@/components/dashboard/pratiche-list"
import CreatePraticaModal from "@/components/dashboard/create-pratica-modal"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [pratiche, setPratiche] = useState([])

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase.from("practices").select("*").order("created_at", { ascending: false })

        setPratiche(data || [])
      }

      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 bg-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Pratiche</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            + Nuova Pratica
          </button>
        </div>

        <PraticheList pratiche={pratiche} onRefresh={() => {}} />

        {showCreateModal && (
          <CreatePraticaModal
            onClose={() => setShowCreateModal(false)}
            onCreated={() => {
              setShowCreateModal(false)
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
