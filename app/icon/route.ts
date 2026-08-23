import { promises as fs } from 'fs'
import path from 'path'
import { loadDashboardState } from '@/lib/dashboard-store'
import { getStorageProvider } from '@/lib/storage'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  let logoUrl: string | null = null
  try {
    const state = await loadDashboardState()
    logoUrl = state.settings.logoUrl || null
  } catch {}
  if (!logoUrl) logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || null
  if (logoUrl) {
    try {
      if (logoUrl.startsWith('/uploads/')) {
        const key = logoUrl.replace(/^\/uploads\//, '')
        const file = await getStorageProvider().read(key)
        return new Response(new Uint8Array(file.body), {
          headers: { 'Content-Type': file.contentType, 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
        })
      }
      if (/^https?:\/\//i.test(logoUrl)) {
        const res = await fetch(logoUrl, { cache: 'no-store' })
        if (res.ok) {
          const buf = await res.arrayBuffer()
          const ct = res.headers.get('content-type') || 'image/png'
          return new Response(buf, {
            headers: { 'Content-Type': ct, 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
          })
        }
      }
    } catch {}
  }
  try {
    const p = path.join(process.cwd(), 'public', 'icon-light-32x32.png')
    const buf = await fs.readFile(p)
    return new Response(new Uint8Array(buf), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' } })
  } catch {}
  return new Response(null, { status: 404 })
}
