import { type NextRequest, NextResponse } from "next/server"

interface Location {
  id: string
  lat: number
  lng: number
  name: string
  urgency: boolean
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function optimizeRoute(home: Location, locations: Location[]): Location[] {
  // Separate urgent and non-urgent
  const urgent = locations.filter((l) => l.urgency)
  const nonUrgent = locations.filter((l) => !l.urgency)

  // Greedy nearest neighbor for each group
  const optimizeGroup = (group: Location[]): Location[] => {
    if (group.length === 0) return []
    const result = [group[0]]
    const remaining = group.slice(1)

    while (remaining.length > 0) {
      const current = result[result.length - 1]
      let nearest = remaining[0]
      let minDist = haversineDistance(current.lat, current.lng, nearest.lat, nearest.lng)

      for (let i = 1; i < remaining.length; i++) {
        const dist = haversineDistance(current.lat, current.lng, remaining[i].lat, remaining[i].lng)
        if (dist < minDist) {
          nearest = remaining[i]
          minDist = dist
        }
      }

      result.push(nearest)
      remaining.splice(remaining.indexOf(nearest), 1)
    }

    return result
  }

  return [...optimizeGroup(urgent), ...optimizeGroup(nonUrgent)]
}

export async function POST(request: NextRequest) {
  try {
    const { home, locations } = await request.json()

    const optimized = optimizeRoute(home, locations)
    const totalDistance = optimized.reduce((sum, _, i) => {
      if (i === 0) return sum
      const prev = optimized[i - 1]
      const curr = optimized[i]
      return sum + haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng)
    }, 0)

    return NextResponse.json({
      optimized,
      totalDistance: totalDistance.toFixed(2),
    })
  } catch (error) {
    console.error("Routing error:", error)
    return NextResponse.json({ error: "Routing failed" }, { status: 500 })
  }
}
