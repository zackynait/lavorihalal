"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"

export default function PraticheListPage() {
  const [pratiche, setPratiche] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPratiche = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("practices").select("*").order("created_at", { ascending: false })

      setPratiche(data || [])
      setLoading(false)
    }

    fetchPratiche()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="h-12 w-12 bg-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento pratiche...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Tutte le Pratiche</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Titolo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Via</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Piano</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pratiche.map((pratica) => (
                <tr key={pratica.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{pratica.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pratica.via}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                        pratica.status === "completed"
                          ? "bg-green-500"
                          : pratica.status === "in_progress"
                            ? "bg-blue-500"
                            : "bg-yellow-500"
                      }`}
                    >
                      {pratica.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                      {pratica.piano}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(pratica.created_at).toLocaleDateString("it-IT")}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      href={`/dashboard/pratiche/${pratica.id}`}
                      className="text-indigo-600 hover:text-indigo-900 font-semibold"
                    >
                      Visualizza
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
