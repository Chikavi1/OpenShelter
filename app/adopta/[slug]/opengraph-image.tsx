import { ImageResponse } from 'next/og'
import { getDb } from '@/lib/db/client'
import { pets, shelterSettings } from '@/lib/db/schema'
import { slugify } from '@/lib/slug'
import { eq } from 'drizzle-orm'

export const runtime = 'nodejs'
export const alt = 'Mascota en adopción'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://keyrescata.netlify.app').replace(/\/$/, '')

  let pet: { name: string; breed: string; species: string; image: string; story: string; age: string; gender: string; size: string; health: string[]; personality: string[]; location: string } | null = null
  let appName = process.env.NEXT_PUBLIC_APP_NAME || 'Key Rescata'
  let logoUrl: string | null = process.env.NEXT_PUBLIC_LOGO_URL || null

  try {
    const db = getDb()
    const [allPets, settingsRows] = await Promise.all([
      db.select({ name: pets.name, breed: pets.breed, species: pets.species, image: pets.image, images: pets.images, story: pets.story, age: pets.age, gender: pets.gender, size: pets.size, health: pets.health, personality: pets.personality, location: pets.location }).from(pets),
      db.select({ name: shelterSettings.name, logoUrl: shelterSettings.logoUrl }).from(shelterSettings).where(eq(shelterSettings.id, 1)).limit(1),
    ])
    // slug puede venir encoded, comparar normalizado
    const target = decodeURIComponent(slug).toLowerCase()
    const found = allPets.find((p) => slugify(p.name) === target || slugify(p.name) === slug)
    if (found) {
      const f = found as any
      const img = f.image || (f.images?.[0] as string | undefined) || ''
      pet = Object.assign({}, f, { image: img }) as any
    }
    if (settingsRows[0]?.name) appName = settingsRows[0].name
    if (settingsRows[0]?.logoUrl) logoUrl = settingsRows[0].logoUrl
  } catch {}

  const name = pet?.name || 'Mascota en adopción'
  const breed = pet?.breed || 'Busca hogar'
  const species = pet?.species || 'Rescatado'
  const age = pet?.age?.trim() || ''
  const gender = pet?.gender || ''
  const size = pet?.size || ''
  const location = pet?.location || ''
  const health = (pet?.health as string[] | undefined)?.slice(0, 2) || []
  const personality = (pet?.personality as string[] | undefined)?.slice(0, 3) || []
  // Resolver imágenes de /uploads/ a data URI para no hacer fetch HTTP a sí mismo (loop)
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
        // detectar mime simple
        const ext = key.split('.').pop()?.toLowerCase()
        const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
        return `data:${mime};base64,${b64}`
      } catch { return `${siteUrl}${url}` }
    }
    return `${siteUrl}${url.startsWith('/') ? url : `/${url}`}`
  }
  const petImage = await resolveToDataUri(pet?.image || null)
  const logo = await resolveToDataUri(logoUrl)

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: '#FDF6EE',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Left: photo */}
        <div style={{ width: '640px', height: '630px', display: 'flex', background: '#3D405B', position: 'relative', overflow: 'hidden' }}>
          {petImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={petImage} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px' }}>🐾</div>
          )}
          <div style={{ position: 'absolute', bottom: '24px', left: '24px', display: 'flex', background: 'rgba(255,255,255,0.95)', borderRadius: '999px', padding: '8px 16px', fontSize: '13px', fontWeight: 800, color: '#3D405B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ● Disponible para adopción
          </div>
        </div>

        {/* Right: info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '34px 36px', justifyContent: 'space-between', background: '#FDF6EE' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {logo ? <img src={logo} alt={appName} style={{ width: '52px', height: '52px', borderRadius: '999px', objectFit: 'cover', background: 'white', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} /> : <div style={{ width: '52px', height: '52px', borderRadius: '999px', background: '#E07A5F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '20px' }}>K</div>}
              <span style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B7280' }}>{appName.toUpperCase()}</span>
            </div>
            <div style={{ width: '40px', height: '3px', background: '#E07A5F', borderRadius: '999px', marginTop: '8px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#E07A5F', letterSpacing: '0.14em', textTransform: 'uppercase' }}>🐾 Adopta a</span>
              <span style={{ fontSize: '84px', fontWeight: 900, lineHeight: '0.88', letterSpacing: '-0.06em', color: '#111827', marginTop: '2px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '520px' }}>{name}</span>
              <span style={{ fontSize: '18px', color: '#374151', marginTop: '8px', fontWeight: 700 }}>{species === 'Perro' ? '🐶' : species === 'Gato' ? '🐱' : '🐾'} {breed} · {species}</span>
            </div>
            {/* chips - GRANDES para móvil, con emojis */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
              {age ? <span style={{ fontSize: '14px', fontWeight: 800, color: '#1F2937', background: 'white', border: '1px solid #E5E7EB', borderRadius: '999px', padding: '8px 14px' }}>🎂 {age}</span> : null}
              {gender ? <span style={{ fontSize: '14px', fontWeight: 800, color: '#1F2937', background: 'white', border: '1px solid #E5E7EB', borderRadius: '999px', padding: '8px 14px' }}>{gender === 'Hembra' ? '💖 Hembra' : '💙 Macho'}</span> : null}
              {size ? <span style={{ fontSize: '14px', fontWeight: 800, color: '#1F2937', background: 'white', border: '1px solid #E5E7EB', borderRadius: '999px', padding: '8px 14px' }}>📏 {size}</span> : null}
              {location ? <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151', background: 'white', border: '1px solid #E5E7EB', borderRadius: '999px', padding: '8px 12px' }}>📍 {location.slice(0, 22)}</span> : null}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '12px 14px', gap: '12px', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '999px', background: '#3D405B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', flexShrink: 0 }}>❤</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>Dale una familia para siempre</span>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>Comparte este link y ayúdanos a encontrarle hogar</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 700 }}>keyrescata.netlify.app</span>
              <span style={{ background: '#111827', color: 'white', padding: '9px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>Quiero adoptar →</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
