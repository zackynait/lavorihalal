"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import FasiSection from "@/components/dashboard/fasi-section"
import ChatSection from "@/components/dashboard/chat-section"

export default function PraticaDetailPage() {
  const params = useParams()
  const [pratica, setPratica] = useState(null)
  const [fasi, setFasi] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPratica = async () => {
      const supabase = createClient()
      const { data: pratikaData } = await supabase.from("practices").select("*").eq("id", params.id).single()

      const { data: fasiData } = await supabase.from("practice_phases").select("*").eq("practice_id", params.id)

      setPratica(pratikaData)
      setFasi(fasiData || [])
      setLoading(false)
    }

    fetchPratica()
  }, [params.id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="h-12 w-12 bg-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento pratica...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!pratica) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Pratica non trovata</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{pratica.title}</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Via</p>
              <p className="font-semibold text-gray-900">{pratica.via}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded text-white text-sm font-semibold ${
                  pratica.status === "completed"
                    ? "bg-green-500"
                    : pratica.status === "in_progress"
                      ? "bg-blue-500"
                      : "bg-yellow-500"
                }`}
              >
                {pratica.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Piano</p>
              <span className="inline-block px-3 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                {pratica.piano}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Data Creazione</p>
              <p className="font-semibold text-gray-900">{new Date(pratica.created_at).toLocaleDateString("it-IT")}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FasiSection praticaId={pratica.id} fasi={fasi} />
          </div>

          <div>
            <ChatSection praticaId={pratica.id} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
