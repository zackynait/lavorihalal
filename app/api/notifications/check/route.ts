import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {},
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check for phases open more than 24 hours
    const twHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: oldPhases } = await supabase
      .from("practice_phases")
      .select("*, practices(title)")
      .eq("status", "pending")
      .lt("created_at", twHoursAgo)

    // Create notifications for admin
    if (oldPhases && oldPhases.length > 0) {
      const notifications = oldPhases.map((phase) => ({
        user_id: user.id,
        practice_id: phase.practice_id,
        type: "follow_up_needed",
        message: `Fase "${phase.title}" aperta da più di 24 ore. Invia follow-up al cliente.`,
      }))

      await supabase.from("notifications").insert(notifications)
    }

    // Fetch unread notifications
    const { data: notifications } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .is("read_at", null)
      .order("created_at", { ascending: false })

    return NextResponse.json({ notifications, count: notifications?.length || 0 })
  } catch (error) {
    console.error("Notification check error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
