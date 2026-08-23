'use client'

import { MapPin, RotateCcw } from 'lucide-react'
import { useEffect, useRef } from 'react'

declare global { interface Window { L?: any } }

const DEFAULT_LOCATION = { latitude: 19.4326, longitude: -99.1332 }

export function EventLocationPicker({ latitude, longitude, onChange }: { latitude: number; longitude: number; onChange: (location: { latitude: number; longitude: number }) => void }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const onChangeRef = useRef(onChange)
  const initialPosition = useRef({ latitude, longitude })

  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  useEffect(() => {
    const styleId = 'leaflet-event-picker-styles'
    if (!document.getElementById(styleId)) { const link = document.createElement('link'); link.id = styleId; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link) }
    const start = () => {
      if (!mapRef.current || !window.L || mapInstance.current) return
      const L = window.L
      const position: [number, number] = [initialPosition.current.latitude || DEFAULT_LOCATION.latitude, initialPosition.current.longitude || DEFAULT_LOCATION.longitude]
      const map = L.map(mapRef.current, { zoomControl: true }).setView(position, 13)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map)
      const marker = L.marker(position, { draggable: true }).addTo(map)
      marker.on('dragend', () => { const next = marker.getLatLng(); onChangeRef.current({ latitude: next.lat, longitude: next.lng }) })
      mapInstance.current = map
      markerRef.current = marker
    }
    if (window.L) start()
    else { const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.async = true; script.onload = start; document.body.appendChild(script) }
    return () => { mapInstance.current?.remove(); mapInstance.current = null; markerRef.current = null }
  }, [])

  useEffect(() => { if (!mapInstance.current || !markerRef.current) return; const next: [number, number] = [latitude, longitude]; markerRef.current.setLatLng(next); mapInstance.current.panTo(next) }, [latitude, longitude])

  const reset = () => onChange(DEFAULT_LOCATION)
  return <div className="overflow-hidden rounded-2xl border border-foreground/15 bg-secondary"><div ref={mapRef} className="h-64 w-full" /><div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 bg-background px-4 py-3 text-xs text-muted-foreground"><span className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> Arrastra el pin para ajustar el punto exacto.</span><button type="button" onClick={reset} className="inline-flex items-center gap-1 rounded-full border border-foreground/15 px-3 py-1.5 font-medium transition hover:bg-secondary"><RotateCcw className="size-3.5" /> CDMX</button></div></div>
}
