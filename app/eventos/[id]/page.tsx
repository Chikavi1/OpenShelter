import type { Metadata } from 'next'
import { EventDetailClient } from '@/components/public/event-detail-client'
import { loadDashboardState } from '@/lib/dashboard-store'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  try {
    const state = await loadDashboardState()
    const event = state.events.find((e) => e.id === id)
    if (!event) return {}
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const title = `${event.title} | ${state.settings.name || 'Refugio Huellas'}`
    const description = event.description?.slice(0, 155) || `Evento ${event.category} el ${event.eventDate} en ${event.location}`
    const image = event.image || '/events.png'
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: image, width: 1200, height: 630, alt: event.title }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
      alternates: { canonical: `${siteUrl}/eventos/${id}` },
    }
  } catch {
    return {}
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EventDetailClient id={id} />
}
