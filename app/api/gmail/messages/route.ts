import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const headerToken = request.headers.get("authorization")?.replace("Bearer ", "")
  const cookieToken = request.cookies.get("gmail_token")?.value
  const token = cookieToken || headerToken

  if (!token) {
    console.log("Gmail messages: missing token")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Gmail list messages failed:", data)
      return NextResponse.json({ error: "Failed to fetch emails" }, { status: response.status })
    }

    // Fetch full message details
    const messages = await Promise.all(
      (data.messages || []).map(async (msg: any) => {
        const msgResponse = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const msgData = await msgResponse.json()

        if (!msgResponse.ok) {
          console.error("Gmail get message failed:", { id: msg.id, error: msgData })
        }
        const headers = msgData.payload.headers

        return {
          id: msg.id,
          from: headers.find((h: any) => h.name === "From")?.value || "",
          subject: headers.find((h: any) => h.name === "Subject")?.value || "No Subject",
          date: headers.find((h: any) => h.name === "Date")?.value || "",
          body: msgData.snippet || "",
        }
      }),
    )

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Gmail API error:", error)
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 })
  }
}
