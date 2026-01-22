import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const headerToken = authHeader?.split(' ')[1]
    const cookieToken = request.cookies.get('gmail_token')?.value
    const token = cookieToken || headerToken
    
    if (!token) {
      return new Response(JSON.stringify({ valid: false, error: 'No token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Verify the token with Google's token info endpoint
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`)
    
    if (!response.ok) {
      return new Response(JSON.stringify({ valid: false, error: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    
    // Check if the token is valid and has the required scopes
    if (data.audience !== process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      return new Response(JSON.stringify({ valid: false, error: 'Invalid token audience' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ valid: true, email: data.email }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return new Response(JSON.stringify({ valid: false, error: 'Token verification failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
