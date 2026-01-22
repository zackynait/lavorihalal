"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ChatSection({ praticaId }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      const { data } = await supabase
        .from("practice_chat")
        .select("*")
        .eq("practice_id", praticaId)
        .order("created_at", { ascending: true })

      setMessages(data || [])
    }

    fetchData()
  }, [praticaId])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const supabase = createClient()
    const { data } = await supabase
      .from("practice_chat")
      .insert([
        {
          practice_id: praticaId,
          user_id: user?.id,
          message: newMessage,
        },
      ])
      .select()

    setMessages([...messages, data[0]])
    setNewMessage("")
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col h-96">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Chat Collaboratori</h2>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-gray-50 rounded p-3">
            <p className="text-xs text-gray-500 font-semibold mb-1">
              {new Date(msg.created_at).toLocaleTimeString("it-IT")}
            </p>
            <p className="text-gray-900">{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Scrivi messaggio..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Invia
        </button>
      </div>
    </div>
  )
}
