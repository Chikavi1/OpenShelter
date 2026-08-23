import type { Metadata } from 'next'
import { EventDetailClient } from '@/components/public/event-detail-client'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  // Evitar tocar DB en metadata (causaba 500 en Netlify si el pool cuelga).
  return {
    title: 'Evento — Refugio Huellas',
    alternates: { canonical: `${siteUrl}/eventos/${id}` },
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EventDetailClient id={id} />
}
