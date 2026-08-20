import { NextResponse } from 'next/server'
import { ensureSession } from '@/lib/http-session'
import { getStorageProvider } from '@/lib/storage'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const authError = await ensureSession(request)
  if (authError) return authError

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const asset = await getStorageProvider().upload({
    filename: file.name,
    contentType: file.type || undefined,
    body: buffer,
  })

  return NextResponse.json(asset)
}
