import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    let bodyRefreshToken: string | undefined

    try {
      const contentType = request.headers.get("content-type")
      if (contentType?.includes("application/json")) {
        const body = await request.json().catch(() => ({}))
        bodyRefreshToken = body?.refresh_token
      }
    } catch {
      bodyRefreshToken = undefined
    }

    const cookieRefreshToken = request.cookies.get("gmail_refresh_token")?.value
    const refresh_token = bodyRefreshToken || cookieRefreshToken
    
    if (!refresh_token) {
      return NextResponse.json({ error: "No refresh token provided" }, { status: 400 })
    }

    // Exchange refresh token for new access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        refresh_token: refresh_token,
        grant_type: 'refresh_token',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Token refresh failed:', data)
      return NextResponse.json(
        { error: data.error_description || 'Failed to refresh token' },
        { status: response.status },
      )
    }

    const isProduction = process.env.NODE_ENV === "production"
    const nextResponse = NextResponse.json(
      {
        access_token: data.access_token,
        expires_in: data.expires_in || 3600,
        token_type: data.token_type || "Bearer",
      },
      { status: 200 },
    )

    if (data.access_token) {
      nextResponse.cookies.set({
        name: "gmail_token",
        value: data.access_token,
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: data.expires_in || 3600,
      })
    }

    return nextResponse

  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error during token refresh' },
      { status: 500 },
    )
  }
}
