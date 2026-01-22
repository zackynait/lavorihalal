import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const error = request.nextUrl.searchParams.get("error")

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error)
    return NextResponse.redirect(
      new URL(`/dashboard/gmail?error=${encodeURIComponent(error)}`, request.url)
    )
  }

  if (!code) {
    console.error("No authorization code received")
    return NextResponse.redirect(
      new URL("/dashboard/gmail?error=no_code_provided", request.url)
    )
  }

  try {
    // Use production URL for OAuth callback
    const baseUrl = 'https://v0-pronto-intervento-app.vercel.app'
    
    // Log for debugging
    console.log('Using base URL for OAuth callback:', baseUrl)

    // Exchange code for token
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: 'https://v0-pronto-intervento-app.vercel.app/api/gmail/callback',
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await response.json()

    if (!response.ok) {
      console.error("Token exchange failed:", tokenData)
      const errorMessage = tokenData.error_description || tokenData.error || 'token_exchange_failed'
      return NextResponse.redirect(
        new URL(`/dashboard/gmail?error=${encodeURIComponent(errorMessage)}`, request.url)
      )
    }

    if (!tokenData.access_token) {
      console.error("No access token in response:", tokenData)
      return NextResponse.redirect(
        new URL("/dashboard/gmail?error=no_access_token", request.url)
      )
    }

    // Create a response for redirection
    const redirectResponse = NextResponse.redirect(new URL('/dashboard/gmail', request.url))

    // Set secure cookie options
    const isProduction = process.env.NODE_ENV === 'production'
    
    // Set access token cookie
    redirectResponse.cookies.set({
      name: 'gmail_token',
      value: tokenData.access_token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: tokenData.expires_in || 3600, // Default to 1 hour
    })

    // Store refresh token if available
    if (tokenData.refresh_token) {
      redirectResponse.cookies.set({
        name: 'gmail_refresh_token',
        value: tokenData.refresh_token,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    return redirectResponse

  } catch (error) {
    console.error("OAuth processing error:", error)
    const errorMessage = error instanceof Error ? error.message : 'unknown_error'
    return NextResponse.redirect(
      new URL(`/dashboard/gmail?error=${encodeURIComponent(errorMessage)}`, request.url)
    )
  }
}
