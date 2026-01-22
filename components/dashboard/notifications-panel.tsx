"use client"

import { useEffect, useState } from "react"

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([])
  const [count, setCount] = useState(0)
  const [showPanel, setShowPanel] = useState(false)

  useEffect(() => {
    checkNotifications()
    const interval = setInterval(checkNotifications, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const checkNotifications = async () => {
    try {
      const response = await fetch("/api/notifications/check")
      const data = await response.json()
      setNotifications(data.notifications || [])
      setCount(data.count || 0)
    } catch (error) {
      console.error("Error checking notifications:", error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications/mark-read/${notificationId}`, { method: "POST" })
      setNotifications(notifications.filter((n) => n.id !== notificationId))
      setCount(Math.max(0, count - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  return (
    <div className="relative">
      <button onClick={() => setShowPanel(!showPanel)} className="relative p-2 text-gray-600 hover:text-gray-900">
        🔔
        {count > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {count}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-900">Notifiche ({count})</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500">Nessuna notifica</p>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="p-4 border-b hover:bg-gray-50">
                  <p className="text-sm text-gray-900">{notif.message}</p>
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="text-xs text-indigo-600 hover:text-indigo-900 mt-2"
                  >
                    Segna come letto
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
