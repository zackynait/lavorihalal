import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.redirect(
      new URL(`/dashboard/calendario?error=${encodeURIComponent("missing_google_client_id")}`, request.url),
    )
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

  return NextResponse.redirect(authUrl)
}
