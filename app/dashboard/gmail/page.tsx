"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import EmailList from "@/components/dashboard/email-list"

// Main content component that uses useSearchParams
function GmailContent() {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Check for errors in the URL and handle OAuth code
  useEffect(() => {
    const errorParam = searchParams.get('error')
    const code = searchParams.get('code')

    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }

    if (code) {
      // Chiama l'API callback con il code
      fetch(`/api/gmail/callback?code=${code}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            checkGmailConnection()
          } else {
            setError(data.error || 'Errore durante l\'autenticazione Gmail')
          }
        })
        .catch(err => {
          console.error('Errore nel callback Gmail:', err)
          setError('Errore durante l\'autenticazione Gmail')
        })
    }
  }, [searchParams])

  useEffect(() => {
    checkGmailConnection()
  }, [])

  // Helper function to get cookie value
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null
    return null
  }

  const checkGmailConnection = async () => {
    try {
      console.log('[gmail] checkGmailConnection')

      const visibleToken = getCookie('gmail_token')
      console.log('[gmail] gmail_token visible to JS:', !!visibleToken)

      // Verify the token (server will read httpOnly cookie)
      const response = await fetch('/api/gmail/verify-token', { cache: 'no-store' })

      if (response.ok) {
        setConnected(true)
        await fetchEmails()
        return
      }

      // Try to refresh token if unauthorized
      if (response.status === 401) {
        const refreshed = await refreshToken()
        if (refreshed) {
          await checkGmailConnection()
          return
        }
      }

      setConnected(false)
    } catch (error) {
      console.error('Error checking Gmail connection:', error)
      setConnected(false)
    }
  }

  const refreshToken = async () => {
    try {
      console.log('[gmail] refreshToken')

      const visibleRefresh = getCookie('gmail_refresh_token')
      console.log('[gmail] gmail_refresh_token visible to JS:', !!visibleRefresh)

      // Server will read refresh token from httpOnly cookie
      const response = await fetch('/api/gmail/refresh-token', {
        method: 'POST',
        cache: 'no-store',
      })

      if (response.ok) {
        return true
      }

      console.log('[gmail] refresh failed with status:', response.status)
      setConnected(false)
      return false
    } catch (error) {
      console.error('Error refreshing token:', error)
      setConnected(false)
      return false
    }
  }

  const fetchEmails = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('[gmail] fetchEmails')
      const response = await fetch("/api/gmail/messages", { cache: 'no-store' })

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, try to refresh
          const refreshed = await refreshToken()
          if (refreshed) {
            await fetchEmails()
          }
          return
        }
        throw new Error(`Failed to fetch emails: ${response.statusText}`)
      }
      
      const data = await response.json()
      setEmails(data.messages || [])
      
    } catch (error) {
      console.error('Error fetching emails:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch emails')
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    try {
      setError(null) // Clear any previous errors
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      
      if (!clientId) {
        throw new Error('Google client ID is not configured. Please check your environment variables.')
      }

      // Use production URL for OAuth
      const baseUrl = 'https://v0-pronto-intervento-app.vercel.app'
      const redirectUri = `${baseUrl}/api/gmail/callback`
      
      console.log('Using redirect URI:', redirectUri)  // Debug log
      
      const scope = [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ].join(' ')

      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: scope,
        access_type: 'offline',
        prompt: 'consent',
        include_granted_scopes: 'true'
      })
      
      authUrl.search = params.toString()
      
      // Log the auth URL for debugging (remove in production)
      console.log('Redirecting to Google OAuth:', authUrl.toString())
      
      // Redirect to Google OAuth
      window.location.href = authUrl.toString()
      
    } catch (error) {
      console.error('Error in handleConnect:', error)
      setError(error instanceof Error ? error.message : 'Failed to connect to Google. Please try again.')
    }
  }

  const handleDisconnect = async () => {
    // Clear cookies
    document.cookie = 'gmail_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    document.cookie = 'gmail_refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    
    // Reset state
    setConnected(false)
    setEmails([])
    setError(null)
  }

  const handleCreatePratica = async (email: any) => {
    try {
      const praticaData = {
        title: email.subject,
        description: email.body,
        via: "Da determinare",
        piano: "",
        condominio_email: email.from,
        condominio_name: "",
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase.from("practices").insert([
        {
          ...praticaData,
          created_by: user?.id,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])

      if (!error) {
        alert("Pratica creata con successo!")
      } else {
        throw error
      }
    } catch (error) {
      console.error("Error creating practice:", error)
      setError(error instanceof Error ? error.message : 'Errore nella creazione della pratica')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Email & Pratiche</h1>
          <div className="flex space-x-4">
            {connected ? (
              <>
                <button
                  onClick={fetchEmails}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? "Sincronizzazione..." : "Sincronizza Email"}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Disconnetti
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Connetti Gmail
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">Errore di connessione</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{error}</p>
                  {error.includes('redirect_uri') && (
                    <p className="mt-2 text-sm">
                      Assicurati che l'URL di reindirizzamento sia configurato correttamente in Google Cloud Console.
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    className="text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none"
                    onClick={() => setError(null)}
                  >
                    Chiudi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!connected ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-4">
              Connetti il tuo account Gmail per sincronizzare le email e creare pratiche
            </p>
            <button
              onClick={handleConnect}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-8 rounded-lg transition"
            >
              Accedi a Gmail
            </button>
          </div>
        ) : (
          <EmailList emails={emails} onCreatePratica={handleCreatePratica} />
        )}
      </div>
    </DashboardLayout>
  )
}

// Main page component with Suspense boundary
export default function GmailPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    }>
      <GmailContent />
    </Suspense>
  )
}