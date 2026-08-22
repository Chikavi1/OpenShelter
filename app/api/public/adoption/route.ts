import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import { getDb } from '@/lib/db/client'
import { adoptionApplications, pets } from '@/lib/db/schema'
import { setupDatabase } from '@/lib/db/setup'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null) as {
    applicantName?: string
    applicantEmail?: string
    applicantPhone?: string
    petName?: string
    petId?: string | null
    petImage?: string
    homeType?: 'Casa' | 'Departamento' | 'Otro'
    hasOtherPets?: boolean
    yard?: boolean
    experience?: string
    customResponses?: Record<string, string | boolean>
  } | null

  const applicantName = payload?.applicantName?.trim()
  const applicantEmail = payload?.applicantEmail?.trim()
  const applicantPhone = payload?.applicantPhone?.trim()
  const petName = payload?.petName?.trim()
  const petId = payload?.petId?.trim() || null
  const petImage = payload?.petImage?.trim()
  const experience = payload?.experience?.trim()

  if (!applicantName || !applicantEmail || !applicantPhone || !petName || !petImage || !experience) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  await setupDatabase()
  const db = getDb()

  await db.insert(adoptionApplications).values({
    id: randomUUID(),
    applicantName,
    applicantEmail,
    applicantPhone,
    petName,
    petId,
    petImage,
    homeType: payload?.homeType ?? 'Casa',
    hasOtherPets: payload?.hasOtherPets ?? false,
    yard: payload?.yard ?? false,
    status: 'Pendiente',
    dateSubmitted: new Date().toISOString(),
    experience,
    customResponses: payload?.customResponses,
  })

  if (petId) {
    await db.update(pets).set({ applicationsCount: sql`${pets.applicationsCount} + 1` }).where(eq(pets.id, petId))
  }

  return NextResponse.json({ ok: true })
}
