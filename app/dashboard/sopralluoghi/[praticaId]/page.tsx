"use client"

import { useParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import SopralluogoForm from "@/components/dashboard/sopralluogo-form"

export default function SopralluogoPage() {
  const params = useParams()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Modulo Sopralluogo</h1>
        <SopralluogoForm praticaId={params.praticaId} />
      </div>
    </DashboardLayout>
  )
}
