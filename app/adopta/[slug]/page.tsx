import type { Metadata } from 'next'
import { getDb } from '@/lib/db/client'
import { pets } from '@/lib/db/schema'
import { slugify } from '@/lib/slug'
import { PetProfileClient } from '@/components/adoption/pet-profile-client'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: raw } = await params
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://keyrescata.netlify.app').replace(/\/$/, '')

  // OG ligero: 1 sola query para título/descripción, la imagen 1200x630 la genera opengraph-image.tsx (branded)
  try {
    const db = getDb()
    const allPets = await db.select({ name: pets.name, story: pets.story, species: pets.species, breed: pets.breed }).from(pets)
    const pet = allPets.find((p) => slugify(p.name) === raw)
    const title = pet ? `${pet.name} — ${pet.breed} en adopción | Key Rescata` : 'Adopta — Key Rescata'
    const description = pet
      ? pet.story?.slice(0, 160) || `Soy ${pet.name}, ${pet.breed} y busco familia. ¡Ayúdame a encontrar hogar!`
      : 'Conoce a nuestros rescatados y encuentra a tu compañero para siempre.'
    const url = `${siteUrl}/adopta/${raw}`
    // Imagen generada dinámicamente con logo + nombre + foto (1200x630, absoluta, nunca localhost)
    const ogImage = `${siteUrl}/adopta/${raw}/opengraph-image`

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: 'profile',
        images: [{ url: ogImage, width: 1200, height: 630, alt: pet?.name || 'Mascota en adopción' }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImage],
      },
    }
  } catch {
    return {
      title: 'Adopta — Key Rescata',
      alternates: { canonical: `${siteUrl}/adopta/${raw}` },
    }
  }
}

export default async function PetProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PetProfileClient slug={slug} />
}
