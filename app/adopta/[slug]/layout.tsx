import type { Metadata } from 'next'
import { loadDashboardState } from '@/lib/dashboard-store'
import { setupDatabase } from '@/lib/db/setup'
import { slugify } from '@/lib/slug'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    await setupDatabase()
    const site = await loadDashboardState()
    const pet = site.pets.find((item) => slugify(item.name) === slug.toLowerCase())
    const name = pet?.name || 'Mascota en adopción'
    const description = pet?.story || 'Conoce a una mascota que busca un hogar responsable.'
    const image = pet?.images?.[0] || pet?.image || '/404.png'
    return { title: `${name} | Adopción responsable`, description, openGraph: { title: `${name} busca un hogar`, description, type: 'profile', images: [{ url: image, alt: `${name} en adopción` }] }, twitter: { card: 'summary_large_image', title: `${name} busca un hogar`, description, images: [image] } }
  } catch { return { title: 'Mascota en adopción' } }
}

export default function PetLayout({ children }: { children: React.ReactNode }) { return children }
