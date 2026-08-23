import type { Metadata } from 'next'
import { loadDashboardState } from '@/lib/dashboard-store'
import { setupDatabase } from '@/lib/db/setup'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  try {
    await setupDatabase()
    const site = await loadDashboardState()
    const event = site.events.find((item) => item.id === id)
    const title = event?.title || 'Evento del refugio'
    const description = event?.description || 'Participa en las actividades y eventos de nuestro refugio.'
    const image = event?.image || '/events.png'
    return { title: `${title} | Eventos`, description, openGraph: { title, description, type: 'website', images: [{ url: image, alt: title }] }, twitter: { card: 'summary_large_image', title, description, images: [image] } }
  } catch { return { title: 'Evento del refugio' } }
}

export default function EventLayout({ children }: { children: React.ReactNode }) { return children }
