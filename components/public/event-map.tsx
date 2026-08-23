'use client'

import { ArrowUpRight, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'

const DEFAULT_COORDINATES = { latitude: 19.4326, longitude: -99.1332 }

export function EventMap({ location, latitude: initialLatitude, longitude: initialLongitude }: { location: string; latitude?: number; longitude?: number }) {
  const [coordinates, setCoordinates] = useState({ latitude: initialLatitude || DEFAULT_COORDINATES.latitude, longitude: initialLongitude || DEFAULT_COORDINATES.longitude })

  useEffect(() => {
    if (initialLatitude && initialLongitude) return
    if (!location.trim()) return
    const controller = new AbortController()

    fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(location)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : [])
      .then((results: Array<{ lat: string; lon: string }>) => {
        const result = results[0]
        if (result) setCoordinates({ latitude: Number(result.lat), longitude: Number(result.lon) })
      })
      .catch(() => undefined)

    return () => controller.abort()
  }, [location, initialLatitude, initialLongitude])

  const { latitude, longitude } = coordinates
  const mapQuery = initialLatitude && initialLongitude ? `${latitude},${longitude}` : (location || `${latitude},${longitude}`)
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`

  return (
    <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-secondary shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-foreground/10 bg-card px-4 py-3.5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="truncate">{location || 'Ubicación por confirmar'}</span>
        </div>
        <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-secondary">
          Abrir en Google Maps
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
      <iframe title={`Mapa de ${location}`} src={mapUrl} className="h-[28rem] w-full border-0 sm:h-[34rem]" loading="lazy" />
    </div>
  )
}
