"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard/dashboard-layout"

function htmlToText(input: string) {
  return input
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\s*\/\s*p\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function CalendarioGiornalieroContent() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const searchParams = useSearchParams()

  const handleConnect = async () => {
    try {
      setError(null)

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      if (!clientId) {
        setError("Google client ID non configurato")
        return
      }

      const baseUrl = "https://v0-pronto-intervento-app.vercel.app"
      const redirectUri = `${baseUrl}/api/google-calendar/callback`
      const scope = [
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ].join(" ")

      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
      authUrl.search = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope,
        access_type: "offline",
        prompt: "consent",
        include_granted_scopes: "true",
      }).toString()

      window.location.href = authUrl.toString()
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Errore connessione Google Calendar"
      setError(msg)
    }
  }

  const getDateParam = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  }

  const fetchEvents = async (date: Date) => {
    setLoading(true)
    setError(null)

    try {
      const tzOffsetMinutes = new Date().getTimezoneOffset()
      const dateParam = getDateParam(date)

      const res = await fetch(
        `/api/google-calendar/events?date=${encodeURIComponent(dateParam)}&tzOffsetMinutes=${encodeURIComponent(
          String(tzOffsetMinutes),
        )}`,
        { cache: "no-store" },
      )

      if (res.status === 401) {
        setConnected(false)
        setEvents([])
        setError("Non connesso a Google Calendar. Clicca su 'Connetti Google Calendar'.")
        return
      }

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setConnected(false)
        setEvents([])
        setError(
          typeof data?.error === "string" ? data.error : `Errore Google Calendar (${res.status})`,
        )
        return
      }

      setConnected(true)
      setEvents(Array.isArray(data?.events) ? data.events : [])
    } catch (e) {
      console.error("[calendario] fetch error:", e)
      const maybeMessage = e && typeof e === "object" && "message" in e ? String((e as any).message) : null
      setConnected(false)
      setError(maybeMessage || "Errore nel caricamento calendario")
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) setError(decodeURIComponent(errorParam))
  }, [searchParams])

  useEffect(() => {
    fetchEvents(selectedDate)
  }, [selectedDate])

  const goPrevDay = () => {
    setSelectedDate((d: Date) => {
      const next = new Date(d)
      next.setDate(next.getDate() - 1)
      next.setHours(0, 0, 0, 0)
      return next
    })
  }

  const goNextDay = () => {
    setSelectedDate((d: Date) => {
      const next = new Date(d)
      next.setDate(next.getDate() + 1)
      next.setHours(0, 0, 0, 0)
      return next
    })
  }

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])
  const visibleHours = useMemo(() => hours.filter((h: number) => h >= 8 && h < 19), [hours])
  const maxPerHour = 10

  const eventsByHour = useMemo(() => {
    const buckets: any[][] = Array.from({ length: 24 }, () => [])
    const dayStart = new Date(selectedDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayStartMs = dayStart.getTime()
    const dayEndMs = dayStartMs + 24 * 60 * 60 * 1000

    for (const ev of events) {
      const startStr = ev?.start?.dateTime
      if (!startStr) continue
      const endStr = ev?.end?.dateTime || startStr

      const startMs = new Date(startStr).getTime()
      let endMs = new Date(endStr).getTime()

      if (!Number.isFinite(startMs)) continue
      if (!Number.isFinite(endMs) || endMs <= startMs) endMs = startMs + 1

      if (endMs <= dayStartMs || startMs >= dayEndMs) continue

      for (let h = 0; h < 24; h += 1) {
        const slotStart = dayStartMs + h * 60 * 60 * 1000
        const slotEnd = slotStart + 60 * 60 * 1000
        if (startMs < slotEnd && endMs > slotStart) buckets[h].push(ev)
      }
    }

    return buckets
  }, [events, selectedDate])

  const countByHour = useMemo(() => {
    return eventsByHour.map((bucket: any[]) => bucket.length)
  }, [eventsByHour])

  const sortedEvents = useMemo(() => {
    return [...events].sort((a: any, b: any) => {
      const ta = a?.start?.dateTime || a?.start?.date
      const tb = b?.start?.dateTime || b?.start?.date
      const t1 = ta ? new Date(ta).getTime() : 0
      const t2 = tb ? new Date(tb).getTime() : 0
      return t1 - t2
    })
  }, [events])

  const dayLabel = selectedDate.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const formatHour = (h: number) => String(h).padStart(2, "0") + ":00"
  const formatSlot = (h: number) => `${String(h).padStart(2, "0")}-${String((h + 1) % 24).padStart(2, "0")}`

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Calendario</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={goPrevDay}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              type="button"
            >
              ◄
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-500">Giorno selezionato</div>
              <div className="font-semibold text-gray-900 capitalize">{dayLabel}</div>
            </div>

            <button
              onClick={goNextDay}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              type="button"
            >
              ►
            </button>

            {!connected ? (
              <button
                onClick={handleConnect}
                className="ml-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                type="button"
              >
                Connetti Google Calendar
              </button>
            ) : (
              <button
                onClick={async () => {
                  await fetch("/api/google-calendar/disconnect", { method: "POST" }).catch(() => null)
                  setConnected(false)
                  setEvents([])
                }}
                className="ml-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                type="button"
              >
                Disconnetti
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Eventi per ora</h2>

          <div className="mb-4 text-sm text-gray-500">
            Eventi trovati: <span className="font-semibold text-gray-700">{events.length}</span>
          </div>

          {loading ? (
            <div className="py-10 text-center text-gray-600">Caricamento...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {visibleHours.map((h: number) => {
                const count = countByHour[h]
                const available = Math.max(0, maxPerHour - count)
                const pct = Math.min(100, Math.round((Math.min(count, maxPerHour) / maxPerHour) * 100))
                const fillClass =
                  available === 0 ? "bg-red-600" : available <= 2 ? "bg-yellow-500" : "bg-green-600"
                return (
                  <div
                    key={h}
                    className="flex items-center justify-between px-4 py-3 rounded-lg border bg-gray-50"
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">{formatSlot(h)}</div>
                        <div className="text-sm text-gray-700">
                          {count} / {maxPerHour} · disp {available}
                        </div>
                      </div>
                      <div className="mt-2 h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div className={`h-full ${fillClass}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Eventi del giorno</h2>

          {loading ? (
            <div className="py-10 text-center text-gray-600">Caricamento...</div>
          ) : sortedEvents.length === 0 ? (
            <div className="text-gray-600">
              Nessun evento per questo giorno.
            </div>
          ) : (
            <div className="space-y-4">
              {visibleHours.map((h: number) => {
                const bucket = eventsByHour[h] || []
                if (bucket.length === 0) return null

                return (
                  <div key={h} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900">{formatSlot(h)}</div>
                      <div className="text-sm text-gray-700">
                        {bucket.length} {bucket.length === 1 ? "evento" : "eventi"}
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {bucket
                        .slice()
                        .sort((a: any, b: any) => {
                          const ta = a?.start?.dateTime ? new Date(a.start.dateTime).getTime() : 0
                          const tb = b?.start?.dateTime ? new Date(b.start.dateTime).getTime() : 0
                          return ta - tb
                        })
                        .map((ev: any) => {
                          const start = ev?.start?.dateTime || ""
                          const end = ev?.end?.dateTime || ""
                          const title = ev?.summary || "Evento"
                          const location = typeof ev?.location === "string" ? ev.location : ""
                          const descriptionRaw = typeof ev?.description === "string" ? ev.description : ""
                          const description = descriptionRaw ? htmlToText(descriptionRaw) : ""

                          const startDt = start ? new Date(start) : null
                          const endDt = end ? new Date(end) : null
                          const time =
                            startDt && Number.isFinite(startDt.getTime())
                              ? startDt.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
                              : ""
                          const timeEnd =
                            endDt && Number.isFinite(endDt.getTime())
                              ? endDt.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
                              : ""

                          return (
                            <div key={ev.id} className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 truncate">{title}</div>
                                {location && <div className="text-sm text-gray-600 truncate">{location}</div>}
                                {description && (
                                  <div className="text-sm text-gray-600 mt-1 whitespace-pre-line line-clamp-3">
                                    {description}
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-gray-700 whitespace-nowrap">
                                {time}
                                {time && timeEnd ? `-${timeEnd}` : ""}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function CalendarioGiornalieroPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-gray-600">Caricamento...</div>}>
      <CalendarioGiornalieroContent />
    </Suspense>
  )
}
