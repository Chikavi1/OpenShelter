export const dynamic = 'force-dynamic'
import { ImageResponse } from 'next/og'
import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db/client'
import { pets, shelterSettings } from '@/lib/db/schema'
import { getStorageProvider } from '@/lib/storage'

export const alt = 'Key Rescata — Adopción responsable'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

function initials(name: string) { return name.trim().split(/\s+/).slice(0,2).map(s=>s[0]?.toUpperCase()??'').join('') || 'KR' }

async function toDataUri(url: string, siteUrl: string): Promise<string | null> {
  if (!url) return null
  if (url.startsWith('data:')) return url
  if (url.startsWith('/uploads/')) {
    try { const key = url.replace(/^\/uploads\//,''); const buf = await getStorageProvider().read(key) as unknown as Buffer; const ext = key.split('.').pop()?.toLowerCase() || 'jpeg'; const mime = ext==='png'?'image/png':ext==='webp'?'image/webp':'image/jpeg'; return `data:${mime};base64,${buf.toString('base64')}` } catch { return null }
  }
  try { const full = url.startsWith('http')?url:`${siteUrl}${url.startsWith('/')?'': '/'}${url}`; const res = await fetch(full, { next: { revalidate: 3600 }}); if (!res.ok) return null; const ct = res.headers.get('content-type') || 'image/jpeg'; const ab = await res.arrayBuffer(); return `data:${ct};base64,${Buffer.from(ab).toString('base64')}` } catch { return null }
}

export default async function Image() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://keyrescata.netlify.app').replace(/\/$/, '')
  let appName = process.env.NEXT_PUBLIC_APP_NAME || 'Key Rescata'
  let logoUrl: string | null = process.env.NEXT_PUBLIC_LOGO_URL || null
  let petsCount = 0
  let adoptedCount = 0
  try {
    const db = getDb()
    const [allPets, rows] = await Promise.all([
      db.select({ status: pets.status }).from(pets),
      db.select({ name: shelterSettings.name, logoUrl: shelterSettings.logoUrl }).from(shelterSettings).where(eq(shelterSettings.id, 1)).limit(1),
    ])
    petsCount = allPets.length
    adoptedCount = allPets.filter(p=>p.status==='Adoptado').length
    if (rows[0]?.name) appName = rows[0].name
    if (rows[0]?.logoUrl) logoUrl = rows[0].logoUrl
  } catch {}
  const logoData = logoUrl ? await toDataUri(logoUrl, siteUrl) : null
  const heroData = await toDataUri('https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80', siteUrl)
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#F4F1DE', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ display: 'flex', width: '58%', height: '100%', position: 'relative', background: '#111827', overflow: 'hidden' }}>
          {heroData ? <img src={heroData} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92 }} /> : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%', background:'#111827'}}><span style={{ fontSize:96 }}></span></div>}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 28, left: 32, right: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ display:'inline-flex', alignSelf:'flex-start', background:'rgba(255,255,255,0.95)', color:'#111827', fontSize:11, fontWeight:700, letterSpacing:1.2, padding:'6px 12px', borderRadius:999, textTransform:'uppercase' as any }}>{petsCount} patitas · {adoptedCount} adopciones felices</span>
            <p style={{ color:'white', fontSize:13, lineHeight:1.4, opacity:0.92, margin:0 }}>Huellas que se convierten en familia</p>
          </div>
          {logoData && <div style={{ position:'absolute', top:24, left:24, display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.96)', padding:'8px 14px', borderRadius:999, boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}><img src={logoData} alt="" style={{ width:36, height:36, borderRadius:999, objectFit:'cover',  }} /><span style={{ fontSize:14, fontWeight:800, color:'#111827' }}>{appName}</span></div>}
        </div>
        <div style={{ display:'flex', flexDirection:'column', width:'42%', height:'100%', padding:'36px 32px', background:'#F4F1DE', justifyContent:'space-between' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:'#E07A5F', textTransform:'uppercase' as any }}>Adopción responsable · Veracruz</span>
            <h1 style={{ fontSize:44, fontWeight:900, lineHeight:0.95, letterSpacing:-1.5, color:'#3D405B', margin:0 }}>{appName}</h1>
            <p style={{ fontSize:15, lineHeight:1.6, color:'#3D405B', opacity:0.75, margin:'4px 0 0 0' }}>El amor no se compra. Rescata, adopta y dale una segunda oportunidad a una vida.</p>
            <div style={{ display:'flex', gap:8, marginTop:10 }}>
              <span style={{ background:'#81B29A', color:'white', fontSize:12, fontWeight:700, padding:'8px 14px', borderRadius:999 }}> Adoptar</span>
              <span style={{ background:'white', color:'#3D405B', border:'1px solid rgba(61,64,91,0.12)', fontSize:12, fontWeight:700, padding:'8px 14px', borderRadius:999 }}>{petsCount} en adopción</span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'white', borderRadius:16, padding:'12px 14px', boxShadow:'0 1px 0 rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize:11, fontWeight:700, color:'#3D405B', opacity:0.6 }}>keyrescata.netlify.app</span>
            <span style={{ background:'#3D405B', color:'white', fontSize:12, fontWeight:700, padding:'8px 14px', borderRadius:999 }}>Quiero adoptar →</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
