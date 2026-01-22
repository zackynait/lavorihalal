"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import { format } from "date-fns"
import { it } from "date-fns/locale"

type Sopralluogo = {
  id: string
  pratica_id: string
  data_sopralluogo: string
  esito: string | null
  note: string | null
  pratica: {
    id: string
    title: string
    address: string
  } | null
}

export default function SopralluoghiPage() {
  const [sopralluoghi, setSopralluoghi] = useState<Sopralluogo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    dataDa: "",
    dataA: "",
    esito: ""
  })

  const fetchSopralluoghi = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      let query = supabase
        .from('sopralluoghi')
        .select(`
          *,
          pratica:pratiche(id, title, address)
        `)
        .order('data_sopralluogo', { ascending: false })

      // Apply filters
      if (filters.dataDa) {
        query = query.gte('data_sopralluogo', `${filters.dataDa}T00:00:00`)
      }
      if (filters.dataA) {
        query = query.lte('data_sopralluogo', `${filters.dataA}T23:59:59`)
      }
      if (filters.esito) {
        query = query.eq('esito', filters.esito)
      }

      const { data, error } = await query

      if (error) throw error
      setSopralluoghi(data || [])
    } catch (err) {
      console.error('Error fetching sopralluoghi:', err)
      setError('Errore nel caricamento dei sopralluoghi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSopralluoghi()
  }, [filters])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo sopralluogo?')) return
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('sopralluoghi')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setSopralluoghi(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Error deleting sopralluogo:', err)
      alert('Errore durante l\'eliminazione del sopralluogo')
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="h-12 w-12 bg-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento sopralluoghi...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Sopralluoghi</h1>
          <Link
            href="/dashboard/sopralluoghi/nuovo"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Nuovo Sopralluogo
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Filtri</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Da data</label>
              <input
                type="date"
                name="dataDa"
                value={filters.dataDa}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">A data</label>
              <input
                type="date"
                name="dataA"
                value={filters.dataA}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Esito</label>
              <select
                name="esito"
                value={filters.esito}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Tutti</option>
                <option value="programmato">Programmato</option>
                <option value="completato">Completato</option>
                <option value="annullato">Annullato</option>
                <option value="rinviato">Rinviato</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ dataDa: "", dataA: "", esito: "" })}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
              >
                Reset Filtri
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data e Ora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pratica
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Indirizzo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Esito
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sopralluoghi.length > 0 ? (
                  sopralluoghi.map((sopralluogo) => (
                    <tr key={sopralluogo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {format(new Date(sopralluogo.data_sopralluogo), 'PPPp', { locale: it })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-indigo-600">
                          {sopralluogo.pratica?.title || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {sopralluogo.pratica?.address || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          sopralluogo.esito === 'completato' ? 'bg-green-100 text-green-800' :
                          sopralluogo.esito === 'annullato' ? 'bg-red-100 text-red-800' :
                          sopralluogo.esito === 'rinviato' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {sopralluogo.esito?.charAt(0).toUpperCase() + sopralluogo.esito?.slice(1) || 'Programmato'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {sopralluogo.note || 'Nessuna nota'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/dashboard/sopralluoghi/${sopralluogo.id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Dettagli
                        </Link>
                        <button
                          onClick={() => handleDelete(sopralluogo.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Elimina
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nessun sopralluogo trovato
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
