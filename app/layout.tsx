import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SiteTheme } from '@/components/site-theme'

export const metadata: Metadata = {
  title: 'Adopta con amor',
  description: 'Rescatamos, rehabilitamos y conectamos mascotas increíbles con hogares para siempre.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  applicationName: 'Refugio Huellas',
  keywords: ['adopción responsable', 'mascotas en adopción', 'refugio de animales', 'rescate animal'],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    title: 'Adopta con amor',
    description: 'Encuentra una mascota y abre la puerta a una nueva historia.',
    siteName: 'Refugio Huellas',
    images: [{ url: '/events.png', width: 1200, height: 630, alt: 'Refugio Huellas' }],
  },
  twitter: { card: 'summary_large_image', title: 'Adopta con amor', description: 'Encuentra una mascota y abre la puerta a una nueva historia.', images: ['/events.png'] },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f1e9',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="bg-background">
      <body><SiteTheme />{children}</body>
    </html>
  )
}
