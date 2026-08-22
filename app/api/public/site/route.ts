import { NextResponse } from 'next/server'
import { loadDashboardState } from '@/lib/dashboard-store'

export async function GET() {
  const state = await loadDashboardState()
  return NextResponse.json(state, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
