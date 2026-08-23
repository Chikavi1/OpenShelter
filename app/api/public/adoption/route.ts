import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import { getDb } from '@/lib/db/client'
import { adoptionApplications, pets } from '@/lib/db/schema'
import { setupDatabase } from '@/lib/db/setup'
import { getStorageProvider } from '@/lib/storage'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? ''
  let payload: {
    applicantName?: string
    applicantEmail?: string
    applicantPhone?: string
    applicantAddress?: string
    applicantCity?: string
    petName?: string
    petId?: string | null
    petImage?: string
    homeType?: 'Casa' | 'Departamento' | 'Otro'
    hasOtherPets?: boolean
    yard?: boolean
    experience?: string
    customResponses?: Record<string, string | boolean>
  } | null = null
  let identityFile: File | null = null
  let addressFile: File | null = null

  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData()
    payload = {
      applicantName: String(form.get('applicantName') ?? ''), applicantEmail: String(form.get('applicantEmail') ?? ''),
      applicantPhone: String(form.get('applicantPhone') ?? ''), petName: String(form.get('petName') ?? ''),
      applicantAddress: String(form.get('applicantAddress') ?? ''), applicantCity: String(form.get('applicantCity') ?? ''),
      petId: String(form.get('petId') ?? ''), petImage: String(form.get('petImage') ?? ''),
      experience: String(form.get('experience') ?? ''), homeType: (String(form.get('homeType') ?? 'Casa') as 'Casa' | 'Departamento' | 'Otro'),
      hasOtherPets: form.get('hasOtherPets') === 'true', yard: form.get('yard') === 'true',
      customResponses: JSON.parse(String(form.get('customResponses') ?? '{}')) as Record<string, string | boolean>,
    }
    identityFile = form.get('identityDocument') instanceof File ? form.get('identityDocument') as File : null
    addressFile = form.get('addressDocument') instanceof File ? form.get('addressDocument') as File : null
  } else {
    payload = await request.json().catch(() => null) as typeof payload
  }

  const applicantName = payload?.applicantName?.trim()
  const applicantEmail = payload?.applicantEmail?.trim()
  const applicantPhone = payload?.applicantPhone?.trim()
  const petName = payload?.petName?.trim()
  const petId = payload?.petId?.trim() || null
  const petImage = payload?.petImage?.trim()
  const experience = payload?.experience?.trim()

  if (!applicantName || !applicantEmail || !applicantPhone || !petName || !petImage || !experience || !identityFile || !addressFile) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  const validDocument = (file: File) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) && file.size <= 5 * 1024 * 1024
  if (!validDocument(identityFile) || !validDocument(addressFile)) {
    return NextResponse.json({ error: 'Los documentos deben ser PDF, JPG o PNG y no superar 5 MB.' }, { status: 400 })
  }

  await setupDatabase()
  const db = getDb()
  const [identityAsset, addressAsset] = await Promise.all([
    getStorageProvider().upload({ filename: identityFile.name, contentType: identityFile.type, body: Buffer.from(await identityFile.arrayBuffer()), visibility: 'private' }),
    getStorageProvider().upload({ filename: addressFile.name, contentType: addressFile.type, body: Buffer.from(await addressFile.arrayBuffer()), visibility: 'private' }),
  ])

  await db.insert(adoptionApplications).values({
    id: randomUUID(),
    applicantName,
    applicantEmail,
    applicantPhone,
    applicantAddress: payload?.applicantAddress?.trim() ?? '',
    applicantCity: payload?.applicantCity?.trim() ?? '',
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
    documents: [
      { type: 'Identificación oficial', name: identityFile.name, key: identityAsset.key, url: identityAsset.url, uploadedAt: new Date().toISOString() },
      { type: 'Comprobante de domicilio', name: addressFile.name, key: addressAsset.key, url: addressAsset.url, uploadedAt: new Date().toISOString() },
    ],
  })

  if (petId) {
    await db.update(pets).set({ applicationsCount: sql`${pets.applicationsCount} + 1` }).where(eq(pets.id, petId))
  }

  return NextResponse.json({ ok: true })
}
