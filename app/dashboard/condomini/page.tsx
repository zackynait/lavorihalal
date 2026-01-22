"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"

interface Condominio {
  id?: string
  nome: string
  email: string
  indirizzo: string
  data_acquisizione: string
  created_at?: string
  updated_at?: string
}

// Funzione di formattazione data semplice
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('it-IT');
};

export default function CondominiPage() {
  const [condomini, setCondomini] = useState<Condominio[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Condominio, 'id' | 'created_at' | 'updated_at'>>({ 
    nome: '',
    email: '',
    indirizzo: '',
    data_acquisizione: new Date().toISOString().split('T')[0]
  })
  const supabase = createClient()

  useEffect(() => {
    fetchCondomini()
  }, [])

  const fetchCondomini = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('condomini')
        .select('*')
        .order('nome')
      
      if (error) throw error
      setCondomini(data || [])
    } catch (error) {
      console.error('Errore nel caricamento dei condomini:', error)
      alert('Errore nel caricamento dei condomini')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = editingId
        ? await supabase
            .from('condomini')
            .update({ ...formData, updated_at: new Date().toISOString() })
            .eq('id', editingId)
            .select()
            .single()
        : await supabase
            .from('condomini')
            .insert([{ ...formData, created_at: new Date().toISOString() }])
            .select()
            .single()
      
      if (error) throw error
      
      setFormData({ 
        nome: '', 
        email: '', 
        indirizzo: '',
        data_acquisizione: new Date().toISOString().split('T')[0]
      })
      setEditingId(null)
      fetchCondomini()
      
    } catch (error) {
      console.error('Errore nel salvataggio del condominio:', error)
      alert('Errore nel salvataggio del condominio')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (condominio: Condominio) => {
    setFormData({
      nome: condominio.nome,
      email: condominio.email,
      indirizzo: condominio.indirizzo,
      data_acquisizione: condominio.data_acquisizione.split('T')[0]
    })
    setEditingId(condominio.id!)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo condominio?')) return
    
    try {
      const { error } = await supabase
        .from('condomini')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      fetchCondomini()
    } catch (error) {
      console.error('Errore nell\'eliminazione del condominio:', error)
      alert('Errore nell\'eliminazione del condominio')
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestione Condomini</h1>
        </div>

        {/* Form Aggiungi/Modifica Condominio */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {editingId ? 'Modifica Condominio' : 'Aggiungi Nuovo Condominio'}
            </h2>
            <p className="text-gray-600 text-sm">
              {editingId 
                ? 'Modifica i dati del condominio selezionato' 
                : 'Inserisci i dati del nuovo condominio'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Condominio *
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Es. Palazzo del Sole"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="esempio@condominio.it"
                />
              </div>
              
              <div>
                <label htmlFor="indirizzo" className="block text-sm font-medium text-gray-700 mb-1">
                  Indirizzo *
                </label>
                <input
                  id="indirizzo"
                  name="indirizzo"
                  type="text"
                  value={formData.indirizzo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Via Roma 123, Città"
                />
              </div>
              
              <div>
                <label htmlFor="data_acquisizione" className="block text-sm font-medium text-gray-700 mb-1">
                  Data Acquisizione *
                </label>
                <input
                  id="data_acquisizione"
                  name="data_acquisizione"
                  type="date"
                  value={formData.data_acquisizione}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ 
                      nome: '', 
                      email: '', 
                      indirizzo: '',
                      data_acquisizione: new Date().toISOString().split('T')[0]
                    })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annulla
                </button>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? 'Salvataggio...' : editingId ? 'Aggiorna' : 'Aggiungi'}
              </button>
            </div>
          </form>
        </div>

        {/* Lista Condomini */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Elenco Condomini</h2>
            <p className="text-gray-600 text-sm mt-1">
              Visualizza e gestisci tutti i condomini registrati
            </p>
          </div>
          
          <div className="overflow-x-auto">
            {loading && condomini.length === 0 ? (
              <div className="p-6 text-center">
                <p>Caricamento in corso...</p>
              </div>
            ) : condomini.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">Nessun condominio registrato</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Indirizzo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Acquisizione
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {condomini.map((condominio) => (
                    <tr key={condominio.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {condominio.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {condominio.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {condominio.indirizzo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(condominio.data_acquisizione)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(condominio)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifica
                        </button>
                        <button
                          onClick={() => handleDelete(condominio.id!)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          Elimina
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
