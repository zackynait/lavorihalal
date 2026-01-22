import { type NextRequest, NextResponse } from "next/server"

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  })

  const data = await response.json()
  return { ok: response.ok, status: response.status, data }
}

export async function GET(request: NextRequest) {
  const cookieToken = request.cookies.get("gcal_token")?.value
  const headerToken = request.headers.get("authorization")?.replace("Bearer ", "")
  let token = cookieToken || headerToken

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const dateParam = request.nextUrl.searchParams.get("date")
  const tzOffsetParam = request.nextUrl.searchParams.get("tzOffsetMinutes")
  const tzOffsetMinutes = tzOffsetParam ? Number(tzOffsetParam) : 0

  let start: Date
  let end: Date

  if (dateParam) {
    const [y, m, d] = dateParam.split("-").map((v: string) => Number(v))
    const startUtcMs = Date.UTC(y, (m || 1) - 1, d || 1, 0, 0, 0) + tzOffsetMinutes * 60 * 1000
    start = new Date(startUtcMs)
    end = new Date(startUtcMs + 24 * 60 * 60 * 1000)
  } else {
    const now = new Date()
    const local = new Date(now)
    local.setHours(0, 0, 0, 0)
    start = new Date(local.getTime() + tzOffsetMinutes * 60 * 1000)
    end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
  }

  const fetchEvents = async (accessToken: string) => {
    const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events")
    url.search = new URLSearchParams({
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "250",
    }).toString()

    const resp = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    })

    const data = await resp.json()
    return { ok: resp.ok, status: resp.status, data }
  }

  let result = await fetchEvents(token)

  if (result.status === 401) {
    const refreshToken = request.cookies.get("gcal_refresh_token")?.value
    if (!refreshToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const refreshed = await refreshAccessToken(refreshToken)
    if (!refreshed.ok || !refreshed.data?.access_token) {
      return NextResponse.json({ error: "Failed to refresh token" }, { status: 401 })
    }

    token = refreshed.data.access_token
    result = await fetchEvents(token)

    if (!result.ok) {
      return NextResponse.json({ error: "Failed to fetch events" }, { status: result.status })
    }

    const isProduction = process.env.NODE_ENV === "production"
    const nextResponse = NextResponse.json({ events: result.data?.items || [] }, { status: 200 })
    nextResponse.cookies.set({
      name: "gcal_token",
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: refreshed.data.expires_in || 3600,
    })

    return nextResponse
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.data?.error || "Failed to fetch events" }, { status: result.status })
  }

  return NextResponse.json({ events: result.data?.items || [] }, { status: 200 })
}
