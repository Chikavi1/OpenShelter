import type { Metadata } from 'next'
import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db/client'
import { shelterEvents } from '@/lib/db/schema'
import { EventDetailClient } from '@/components/public/event-detail-client'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://keyrescata.netlify.app').replace(/\/$/, '')

  try {
    const db = getDb()
    const rows = await db.select({ title: shelterEvents.title, description: shelterEvents.description }).from(shelterEvents).where(eq(shelterEvents.id, id)).limit(1)
    const event = rows[0]
    const title = event ? `${event.title} | Key Rescata` : 'Evento — Key Rescata'
    const description = event?.description?.slice(0, 160) || 'Participa en nuestros eventos y ayuda a que más huellas encuentren hogar.'
    const url = `${siteUrl}/eventos/${id}`
    const ogImage = `${siteUrl}/eventos/${id}/opengraph-image`

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: 'website',
        images: [{ url: ogImage, width: 1200, height: 630, alt: event?.title || 'Evento' }],
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
      title: 'Evento — Key Rescata',
      alternates: { canonical: `${siteUrl}/eventos/${id}` },
    }
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EventDetailClient id={id} />
}
