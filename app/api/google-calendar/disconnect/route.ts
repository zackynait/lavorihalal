import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const nextResponse = NextResponse.json({ ok: true }, { status: 200 })
  const isProduction = process.env.NODE_ENV === "production"

  nextResponse.cookies.set({
    name: "gcal_token",
    value: "",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  nextResponse.cookies.set({
    name: "gcal_refresh_token",
    value: "",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })

  return nextResponse
}
