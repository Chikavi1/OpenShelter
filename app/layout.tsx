import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SiteTheme } from '@/components/site-theme'

export const metadata: Metadata = {
  title: 'Adopta con amor',
  description: 'Rescatamos, rehabilitamos y conectamos mascotas increíbles con hogares para siempre.',
  generator: 'v0.app',
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
