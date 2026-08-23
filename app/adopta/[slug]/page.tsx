import type { Metadata } from 'next'
import { PetProfileClient } from '@/components/adoption/pet-profile-client'
import { loadDashboardState } from '@/lib/dashboard-store'
import { slugify } from '@/lib/slug'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: raw } = await params
  const slug = raw.toLowerCase()
  try {
    const state = await loadDashboardState()
    const pet = state.pets.find((p) => slugify(p.name) === slug)
    if (!pet) return {}
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const title = `${pet.name} — ${pet.breed} en adopción | ${state.settings.name || 'Refugio Huellas'}`
    const description = pet.story?.slice(0, 155) || `Conoce a ${pet.name}, ${pet.age} ${pet.breed} busca hogar. ${pet.personality.slice(0, 3).join(', ')}`
    const image = pet.image || pet.images?.[0] || '/events.png'
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: image, width: 1200, height: 630, alt: `${pet.name} en adopción` }],
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      alternates: { canonical: `${siteUrl}/adopta/${raw}` },
    }
  } catch {
    return {}
  }
}

export default async function PetProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PetProfileClient slug={slug} />
}
