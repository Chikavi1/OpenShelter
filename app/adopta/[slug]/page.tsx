import type { Metadata } from 'next'
import { PetProfileClient } from '@/components/adoption/pet-profile-client'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug: raw } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  // No tocar DB aquí: en serverless Netlify el pool puede colgar y dar 500.
  // El detalle real se carga client-side vía /api/public/site; aquí solo canonical base.
  const title = `Adopta — Refugio Huellas`
  return {
    title,
    alternates: { canonical: `${siteUrl}/adopta/${raw}` },
  }
}

export default async function PetProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PetProfileClient slug={slug} />
}
