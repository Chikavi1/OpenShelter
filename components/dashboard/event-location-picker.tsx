'use client'

import { MapPin } from 'lucide-react'
import { useEffect, useRef } from 'react'

declare global { interface Window { L?: any } }

const DEFAULT_LOCATION = { latitude: 19.4326, longitude: -99.1332 }

function createLogoIcon(L: any, logoUrl?: string) {
  const hasLogo = Boolean(logoUrl)
  const html = hasLogo
    ? `<div style="width:48px;height:48px;border-radius:9999px;border:3px solid white;box-shadow:0 4px 16px rgba(0,0,0,0.28);overflow:hidden;background:white;display:grid;place-items:center;"><img src="${logoUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" /></div>`
    : `<div style="width:44px;height:44px;border-radius:9999px;border:3px solid white;box-shadow:0 4px 16px rgba(0,0,0,0.28);background:#0f2e1f;display:grid;place-items:center;color:white;font-size:18px;">●</div>`
  return L.divIcon({ html, className: '', iconSize: [48, 48], iconAnchor: [24, 24] })
}

export function EventLocationPicker({
  latitude,
  longitude,
  onChange,
  logoUrl,
}: {
  latitude: number
  longitude: number
  onChange: (location: { latitude: number; longitude: number }) => void
  logoUrl?: string
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const onChangeRef = useRef(onChange)
  const initialPosition = useRef({ latitude, longitude })

  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  // update icon when logoUrl changes
  useEffect(() => {
    if (!markerRef.current || !window.L) return
    markerRef.current.setIcon(createLogoIcon(window.L, logoUrl))
  }, [logoUrl])

  useEffect(() => {
    const styleId = 'leaflet-event-picker-styles'
    if (!document.getElementById(styleId)) { const link = document.createElement('link'); link.id = styleId; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link) }
    const start = () => {
      if (!mapRef.current || !window.L || mapInstance.current) return
      const L = window.L
      const position: [number, number] = [initialPosition.current.latitude || DEFAULT_LOCATION.latitude, initialPosition.current.longitude || DEFAULT_LOCATION.longitude]
      const map = L.map(mapRef.current, { zoomControl: true }).setView(position, 14)
      // Voyager tiles look like Google Maps (light, muted) vs OSM default
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map)
      const marker = L.marker(position, { draggable: true, icon: createLogoIcon(L, logoUrl) }).addTo(map)
      marker.on('dragend', () => { const next = marker.getLatLng(); onChangeRef.current({ latitude: next.lat, longitude: next.lng }) })
      map.on('click', (e: any) => { marker.setLatLng(e.latlng); onChangeRef.current({ latitude: e.latlng.lat, longitude: e.latlng.lng }) })
      mapInstance.current = map
      markerRef.current = marker
    }
    if (window.L) start()
    else { const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.async = true; script.onload = start; document.body.appendChild(script) }
    return () => { mapInstance.current?.remove(); mapInstance.current = null; markerRef.current = null }
  }, [])

  useEffect(() => { if (!mapInstance.current || !markerRef.current) return; const next: [number, number] = [latitude, longitude]; markerRef.current.setLatLng(next); mapInstance.current.panTo(next) }, [latitude, longitude])

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`

  return (
    <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-secondary shadow-sm">
      <div ref={mapRef} className="h-[340px] w-full sm:h-[420px]" />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/10 bg-card px-4 py-3.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-primary" />
          Arrastra el pin o haz clic en el mapa para ajustar el punto exacto.
        </span>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-secondary"
        >
          Abrir en Google Maps
        </a>
      </div>
    </div>
  )
}
