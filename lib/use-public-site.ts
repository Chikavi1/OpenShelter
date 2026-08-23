'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_DASHBOARD_STATE, type DashboardState } from './dashboard-defaults'
import { applySitePalette } from './theme'

export function usePublicSite() {
  const [state, setState] = useState<DashboardState>(DEFAULT_DASHBOARD_STATE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    applySitePalette(state.settings)
  }, [state.settings])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await fetch('/api/public/site', { cache: 'no-store' })

        if (!response.ok) return

        const data = await response.json() as DashboardState

        if (!cancelled) {
          setState(data)
        }
      } catch {
        // Keep the seeded fallback.
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  return { ...state, loading }
}
