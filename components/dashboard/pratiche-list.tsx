"use client"

import Link from "next/link"

export default function PraticheList({ pratiche }) {
  if (!pratiche || pratiche.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Nessuna pratica trovata. Crea la prima pratica!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Titolo</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Via</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
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
  )
}
