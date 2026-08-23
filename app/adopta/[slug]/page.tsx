'use client'

import { ArrowLeft, PawPrint } from 'lucide-react'
import { use } from 'react'
import { PetProfileSections } from '@/components/adoption/pet-profile-sections'
import { usePublicSite } from '@/lib/use-public-site'
import { slugify } from '@/lib/slug'
import { PublicPageShell } from '@/components/public/public-page-shell'
import { PublicPageLoader } from '@/components/public/public-page-loader'

export default function PetProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const site = usePublicSite()
  const { slug: rawSlug } = use(params)
  if (site.loading) return <PublicPageLoader label="Cargando perfil" />
  const slug = rawSlug.toLowerCase()
  const pet = site.pets.find((item) => slugify(item.name) === slug)
  const appName = site.settings.name || process.env.NEXT_PUBLIC_APP_NAME || ''
  const logoUrl = site.settings.logoUrl || process.env.NEXT_PUBLIC_LOGO_URL

  if (!pet) {
    return (
      <main className="min-h-screen bg-background px-4 py-20 text-center text-foreground">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Mascota no disponible</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-6xl">No hay datos cargados todavía</h1>
        <a href="/catalogo" className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Ver catálogo</a>
      </main>
    )
  }

  return (
    <PublicPageShell appName={appName} logoUrl={logoUrl} contentClassName="mx-auto max-w-[1440px] space-y-6 px-4 sm:px-6 lg:px-10">
      <PetProfileSections pet={pet} appName={appName} />

    </PublicPageShell>
  )
}
