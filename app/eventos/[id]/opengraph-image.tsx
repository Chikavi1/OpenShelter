import { ImageResponse } from 'next/og'
import { getDb } from '@/lib/db/client'
import { shelterEvents, shelterSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const runtime = 'nodejs'
export const alt = 'Evento'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://keyrescata.netlify.app').replace(/\/$/, '')
  let event: { title: string; description: string; image: string; location: string } | null = null
  let appName = process.env.NEXT_PUBLIC_APP_NAME || 'Key Rescata'
  let logoUrl: string | null = process.env.NEXT_PUBLIC_LOGO_URL || null
  try {
    const db = getDb()
    const [rows, settingsRows] = await Promise.all([
      db.select({ title: shelterEvents.title, description: shelterEvents.description, image: shelterEvents.image, location: shelterEvents.location }).from(shelterEvents).where(eq(shelterEvents.id, id)).limit(1),
      db.select({ name: shelterSettings.name, logoUrl: shelterSettings.logoUrl }).from(shelterSettings).where(eq(shelterSettings.id, 1)).limit(1),
    ])
    if (rows[0]) event = rows[0] as any
    if (settingsRows[0]?.name) appName = settingsRows[0].name
    if (settingsRows[0]?.logoUrl) logoUrl = settingsRows[0].logoUrl
  } catch {}

  const title = event?.title || 'Evento especial'
  const desc = (event?.description || 'Acompáñanos a construir una comunidad que transforma vidas.').slice(0, 110)
  async function resolveToDataUri(url: string | null): Promise<string | null> {
    if (!url) return null
    if (url.startsWith('http')) return url
    if (url.startsWith('/uploads/')) {
      try {
        const { getStorageProvider } = await import('@/lib/storage')
        const key = url.replace(/^\/uploads\//, '')
        const file = await getStorageProvider().read(key)
        if (!file?.body) return `${siteUrl}${url}`
        const b64 = file.body.toString('base64')
        const ext = key.split('.').pop()?.toLowerCase()
        const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
        return `data:${mime};base64,${b64}`
      } catch { return `${siteUrl}${url}` }
    }
    return `${siteUrl}${url.startsWith('/') ? url : `/${url}`}`
  }
  const image = await resolveToDataUri(event?.image || null)
  const logo = await resolveToDataUri(logoUrl)

  return new ImageResponse(
    (
      <div style={{ width: '1200px', height: '630px', display: 'flex', background: '#3D405B', color: 'white', fontFamily: 'sans-serif', overflow: 'hidden' }}>
        <div style={{ width: '640px', height: '630px', display: 'flex', background: '#F2CC8F', overflow: 'hidden' }}>
          {image ? <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '100px' }}>🎉</div>}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 44px', justifyContent: 'space-between', background: '#3D405B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {logo ? <img src={logo} alt={appName} style={{ width: '52px', height: '52px', borderRadius: '999px', objectFit: 'cover', background: 'white', border: '2px solid rgba(255,255,255,0.9)' }} /> : <div style={{ width: '52px', height: '52px', borderRadius: '999px', background: '#F2CC8F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3D405B', fontWeight: 900, fontSize: '20px' }}>K</div>}
            <span style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F2CC8F' }}>{appName} · EVENTO</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span style={{ fontSize: '52px', fontWeight: 900, lineHeight: '0.95', letterSpacing: '-0.03em' }}>{title}</span>
            <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.5' }}>{desc}</span>
            {event?.location ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#F2CC8F', fontWeight: 700 }}>📍 {event.location}</span> : null}
          </div>
          <span style={{ background: '#F2CC8F', color: '#3D405B', padding: '10px 22px', borderRadius: '999px', fontSize: '14px', fontWeight: 900, alignSelf: 'flex-start' }}>¡Te esperamos! →</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
