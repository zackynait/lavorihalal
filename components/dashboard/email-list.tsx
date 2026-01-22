"use client"

export default function EmailList({ emails, onCreatePratica }) {
  if (emails.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Nessuna email trovata</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Da</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Oggetto</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Azioni</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {emails.map((email) => (
            <tr key={email.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{email.from}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{email.subject}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{new Date(email.date).toLocaleDateString("it-IT")}</td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => onCreatePratica(email)}
                  className="text-indigo-600 hover:text-indigo-900 font-semibold"
                >
                  Crea Pratica
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
