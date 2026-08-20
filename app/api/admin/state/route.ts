import { NextResponse } from 'next/server'
import { ensureSession } from '@/lib/http-session'
import { loadDashboardState, saveDashboardState } from '@/lib/dashboard-store'
import { setupDatabase } from '@/lib/db/setup'
import type { DashboardState } from '@/lib/dashboard-defaults'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const authError = await ensureSession(request)
  if (authError) return authError

  await setupDatabase()
  const state = await loadDashboardState()
  return NextResponse.json(state)
}

export async function PUT(request: Request) {
  const authError = await ensureSession(request)
  if (authError) return authError

  const payload = await request.json().catch(() => null) as Partial<DashboardState> | null
  if (!payload?.pets || !payload?.applications || !payload?.fosterHomes || !payload?.thanksList || !payload?.settings) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  await setupDatabase()
  await saveDashboardState(payload as DashboardState)
  return NextResponse.json({ ok: true })
}
