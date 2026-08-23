import { NextResponse } from 'next/server'
import { loadDashboardState } from '@/lib/dashboard-store'
import { setupDatabase } from '@/lib/db/setup'

export async function GET() {
  await setupDatabase()
  const state = await loadDashboardState()
  return NextResponse.json(state, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
