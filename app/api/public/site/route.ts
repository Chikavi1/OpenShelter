import { NextResponse } from 'next/server'
import { loadDashboardState } from '@/lib/dashboard-store'
import { setupDatabase } from '@/lib/db/setup'

// Cache en memoria con deduplicación para evitar 7 queries x cada request concurrente
// En serverless cada contenedor mantiene este cache ~60s, suficiente para no saturar el pooler.
let cached: { data: Awaited<ReturnType<typeof loadDashboardState>> | null; expiresAt: number } = { data: null, expiresAt: 0 }
let inflight: Promise<Awaited<ReturnType<typeof loadDashboardState>>> | null = null
const TTL_MS = 60_000

export const dynamic = 'force-dynamic'

export async function GET() {
  const now = Date.now()
  if (cached.data && now < cached.expiresAt) {
    return NextResponse.json(cached.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Cache': 'HIT',
      },
    })
  }

  if (inflight) {
    try {
      const data = await inflight
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120', 'X-Cache': 'HIT-inflight' },
      })
    } catch {
      // cae al fetch fresco
    }
  }

  inflight = (async () => {
    await setupDatabase()
    const state = await loadDashboardState()
    cached = { data: state, expiresAt: Date.now() + TTL_MS }
    return state
  })()

  try {
    const data = await inflight
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Cache': 'MISS',
      },
    })
  } catch (error) {
    console.error('[api/public/site] failed', error)
    // Si tenemos cache stale, servirlo aunque esté expirado para no dar 500
    if (cached.data) {
      return NextResponse.json(cached.data, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120', 'X-Cache': 'STALE' },
      })
    }
    return NextResponse.json({ error: 'No se pudo cargar la información del refugio' }, { status: 503 })
  } finally {
    inflight = null
  }
}
