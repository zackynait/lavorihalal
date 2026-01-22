"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import InvoiceGenerator from "@/components/dashboard/invoice-generator"

export default function FatturePagee() {
  const [fatture, setFatture] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFatture()
  }, [])

  const fetchFatture = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("invoices")
      .select("*, practices(title, description)")
      .order("created_at", { ascending: false })

    setFatture(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="h-12 w-12 bg-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento fatture...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Fatture</h1>
          <InvoiceGenerator onInvoiceCreated={fetchFatture} />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Numero</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Pratica</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Importo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Emissione</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {fatture.map((fattura) => (
                <tr key={fattura.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{fattura.invoice_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{fattura.practices?.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">€ {fattura.amount}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        fattura.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : fattura.status === "sent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {fattura.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(fattura.created_at).toLocaleDateString("it-IT")}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <a href={`#`} className="text-indigo-600 hover:text-indigo-900 font-semibold">
                      Visualizza
                    </a>
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
