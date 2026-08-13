import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Huellas'
const capitalizedAppName = appName.charAt(0).toUpperCase() + appName.slice(1)

export const metadata: Metadata = {
  title: `${capitalizedAppName} — Adopta con amor`,
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
      <body>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body>
    </html>
  )
}
