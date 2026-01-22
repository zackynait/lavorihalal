"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Pratiche", href: "/dashboard/pratiche", icon: "📋" },
    { name: "Condomini", href: "/dashboard/condomini", icon: "🏢" },
    { name: "Email", href: "/dashboard/gmail", icon: "📧" },
    { name: "Calendario", href: "/dashboard/calendario", icon: "🗓️" },
    { name: "Sopralluoghi", href: "/dashboard/sopralluoghi", icon: "🔍" },
    { name: "Interventori", href: "/dashboard/interventori", icon: "👷" },
    { name: "Fatture", href: "/dashboard/fatture", icon: "💰" },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col h-full`}
      >
        <div className="p-4 border-b border-gray-700">
          <h2 className={`font-bold text-lg ${!sidebarOpen && "hidden"}`}>Pronto Intervento</h2>
        </div>

        <nav className="mt-8 space-y-2 px-4 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-all"
              title={item.name}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-gray-200">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all ${!sidebarOpen ? 'px-3' : ''}`}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Esci</span>}
          </button>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`mt-3 w-full flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all ${!sidebarOpen ? 'justify-center' : 'justify-end'}`}
            title={sidebarOpen ? "Riduci" : "Espandi"}
          >
            {sidebarOpen ? "◄" : "☰"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-800">
              {typeof children?.props?.childProp?.segment === 'string' 
                ? children.props.childProp.segment.charAt(0).toUpperCase() + 
                  children.props.childProp.segment.slice(1).replace(/-/g, ' ')
                : 'Dashboard'}
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4">{children}</main>
      </div>
    </div>
  )
}
