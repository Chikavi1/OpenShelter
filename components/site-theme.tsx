'use client'

import { useEffect } from 'react'
import { applySitePalette } from '@/lib/theme'
import { DEFAULT_DASHBOARD_STATE, type ShelterSettings } from '@/lib/dashboard-defaults'

export function SiteTheme() {
  useEffect(() => {
    const loadPalette = async () => {
      try {
        const response = await fetch('/api/public/site', { cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json() as { settings?: ShelterSettings }
        applySitePalette(data.settings ?? DEFAULT_DASHBOARD_STATE.settings)
      } catch {
        applySitePalette(DEFAULT_DASHBOARD_STATE.settings)
      }
    }

    void loadPalette()
  }, [])

  return null
}
