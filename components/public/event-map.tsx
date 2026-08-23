'use client'

import { ArrowUpRight, MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

declare global { interface Window { L?: any } }

const DEFAULT_COORDINATES = { latitude: 19.4326, longitude: -99.1332 }

function createLogoIcon(L: any, logoUrl?: string) {
  const hasLogo = Boolean(logoUrl)
  const html = hasLogo
    ? `<div style="width:48px;height:48px;border-radius:9999px;border:3px solid white;box-shadow:0 4px 16px rgba(0,0,0,0.28);overflow:hidden;background:white;display:grid;place-items:center;"><img src="${logoUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" /></div><div style="width:10px;height:10px;background:white;transform:rotate(45deg);margin:-2px auto 0;box-shadow:0 1px 4px rgba(0,0,0,0.2);"></div>`
    : `<div style="width:44px;height:44px;border-radius:9999px;border:3px solid white;box-shadow:0 4px 16px rgba(0,0,0,0.28);background:#0f2e1f;display:grid;place-items:center;color:white;font-size:18px;">●</div>`
  return L.divIcon({ html, className: '', iconSize: [48, 48], iconAnchor: [24, 33] })
}

export function EventMap({ location, latitude: initialLatitude, longitude: initialLongitude, logoUrl }: { location: string; latitude?: number; longitude?: number; logoUrl?: string }) {
  const [coordinates, setCoordinates] = useState({ latitude: initialLatitude || DEFAULT_COORDINATES.latitude, longitude: initialLongitude || DEFAULT_COORDINATES.longitude })
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (initialLatitude && initialLongitude) return
    if (!location.trim()) return
    const controller = new AbortController()
    fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(location)}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : []))
      .then((results: Array<{ lat: string; lon: string }>) => {
        const result = results[0]
        if (result) setCoordinates({ latitude: Number(result.lat), longitude: Number(result.lon) })
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [location, initialLatitude, initialLongitude])

  useEffect(() => {
    setCoordinates({ latitude: initialLatitude || DEFAULT_COORDINATES.latitude, longitude: initialLongitude || DEFAULT_COORDINATES.longitude })
  }, [initialLatitude, initialLongitude])

  const { latitude, longitude } = coordinates
  const mapQuery = initialLatitude && initialLongitude ? `${latitude},${longitude}` : location || `${latitude},${longitude}`
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`

  // Leaflet con tiles reales de Google — mismo aspecto que el iframe, pero permite cambiar el pin
  useEffect(() => {
    const styleId = 'leaflet-event-map-styles'
    if (!document.getElementById(styleId)) {
      const link = document.createElement('link')
      link.id = styleId
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    const start = () => {
      if (!mapRef.current || !window.L || mapInstance.current) return
      const L = window.L
      const position: [number, number] = [latitude, longitude]
      // Vista informativa: no draggable, no scroll wheel, solo zoom con botones
      const map = L.map(mapRef.current, { zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, keyboard: false, tap: false }).setView(position, 15)
      // Tiles de Google Maps (m = roadmap) — idéntico al iframe, sin cambiar diseño
      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }).addTo(map)
      L.control.zoom({ position: 'bottomright' }).addTo(map)
      const marker = L.marker(position, { icon: createLogoIcon(L, logoUrl), interactive: false, keyboard: false }).addTo(map)
      mapInstance.current = map
      markerRef.current = marker
    }
    if (window.L) start()
    else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.async = true
      script.onload = start
      document.body.appendChild(script)
    }
    return () => {
      mapInstance.current?.remove()
      mapInstance.current = null
      markerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapInstance.current || !markerRef.current) return
    const next: [number, number] = [latitude, longitude]
    markerRef.current.setLatLng(next)
    mapInstance.current.panTo(next)
  }, [latitude, longitude])

  useEffect(() => {
    if (!markerRef.current || !window.L) return
    markerRef.current.setIcon(createLogoIcon(window.L, logoUrl))
  }, [logoUrl])

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
      <div ref={mapRef} className="h-[28rem] w-full sm:h-[34rem]" />
    </div>
  )
}
