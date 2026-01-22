"use client"

import { useState } from "react"

export default function CalendarView({ appointments }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getAppointmentsForDay = (day) => {
    if (!day) return []
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(end.getDate() + 1)

    return appointments.filter((apt) => {
      if (!apt?.scheduled_at) return false
      const dt = new Date(apt.scheduled_at)
      return dt >= start && dt < end
    })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const monthNames = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ]
  const dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <button onClick={prevMonth} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">
          ◄
        </button>
        <h2 className="text-xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">
          ►
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayAppointments = getAppointmentsForDay(day)
          return (
            <div
              key={index}
              className={`aspect-square p-2 rounded-lg border-2 ${
                day
                  ? dayAppointments.length > 0
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-200 bg-white"
                  : "border-transparent bg-gray-50"
              }`}
            >
              {day && (
                <div>
                  <p className="font-semibold text-sm">{day}</p>
                  {dayAppointments.slice(0, 2).map((apt, i) => (
                    <p key={i} className="text-xs text-indigo-600 truncate">
                      {apt.practice_phases?.practices?.title || apt.practices?.title || ""}
                    </p>
                  ))}
                  {dayAppointments.length > 2 && <p className="text-xs text-gray-600">+{dayAppointments.length - 2}</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
