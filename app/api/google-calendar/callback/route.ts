import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const error = request.nextUrl.searchParams.get("error")

  if (error) {
    return NextResponse.redirect(
      new URL(`/dashboard/calendario?error=${encodeURIComponent(error)}`, request.url),
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(`/dashboard/calendario?error=${encodeURIComponent("no_code_provided")}`, request.url),
    )
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: "https://v0-pronto-intervento-app.vercel.app/api/google-calendar/callback",
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await response.json()

    if (!response.ok) {
      const errorMessage = tokenData.error_description || tokenData.error || "token_exchange_failed"
      return NextResponse.redirect(
        new URL(`/dashboard/calendario?error=${encodeURIComponent(errorMessage)}`, request.url),
      )
    }

    if (!tokenData.access_token) {
      return NextResponse.redirect(
        new URL(`/dashboard/calendario?error=${encodeURIComponent("no_access_token")}`, request.url),
      )
    }

    const redirectResponse = NextResponse.redirect(new URL("/dashboard/calendario", request.url))
    const isProduction = process.env.NODE_ENV === "production"

    redirectResponse.cookies.set({
      name: "gcal_token",
      value: tokenData.access_token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: tokenData.expires_in || 3600,
    })

    if (tokenData.refresh_token) {
      redirectResponse.cookies.set({
        name: "gcal_refresh_token",
        value: tokenData.refresh_token,
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      })
    }

    return redirectResponse
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown_error"
    return NextResponse.redirect(
      new URL(`/dashboard/calendario?error=${encodeURIComponent(msg)}`, request.url),
    )
  }
}
