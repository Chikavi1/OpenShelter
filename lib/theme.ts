'use client'

import type { ShelterSettings } from './dashboard-defaults'

const fallback = {
  primary: '#163b2d', secondary: '#e8e1d5', background: '#f5f1e9',
  cta: '#c5e86c', text: '#24352d', surface: '#fcfaf6',
}

export function applySitePalette(settings: ShelterSettings) {
  const palette = { ...fallback, ...settings.palette }
  const root = document.documentElement
  root.style.setProperty('--primary', palette.primary)
  root.style.setProperty('--secondary', palette.secondary)
  root.style.setProperty('--background', palette.background)
  root.style.setProperty('--accent', palette.cta)
  root.style.setProperty('--cta', palette.cta)
  root.style.setProperty('--foreground', palette.text)
  root.style.setProperty('--card', palette.surface)
  root.style.setProperty('--card-foreground', palette.text)
  root.style.setProperty('--secondary-foreground', palette.text)
  root.style.setProperty('--accent-foreground', palette.text)
  root.style.setProperty('--primary-foreground', contrastColor(palette.primary))
  root.style.setProperty('--ring', palette.primary)
}

function contrastColor(hex: string) {
  const value = hex.replace('#', '')
  if (value.length !== 6) return '#ffffff'
  const [r, g, b] = [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16))
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#17231d' : '#ffffff'
}
