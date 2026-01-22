import { Suspense } from "react"
import Link from "next/link"

export const metadata = {
  title: "Pronto Intervento - Gestione Pratiche",
  description: "Sistema di gestione pratiche di pronto intervento",
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 bg-indigo-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-600">Caricamento in corso...</p>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Pronto Intervento</h1>
            <p className="text-xl text-gray-600">Sistema di gestione pratiche avanzato</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nuovo Utente?</h2>
              <p className="text-gray-600 mb-6">Registrati per accedere al sistema</p>
              <Link
                href="/auth/sign-up"
                className="inline-block w-full text-center bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Registrati
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Già Registrato?</h2>
              <p className="text-gray-600 mb-6">Accedi al tuo account</p>
              <Link
                href="/auth/login"
            className="inline-block w-full text-center bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Accedi
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  )
}
