import { NextResponse } from 'next/server'
import { ensureSession } from '@/lib/http-session'
import { getStorageProvider } from '@/lib/storage'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: Promise<{ key: string }> }) {
  const authError = await ensureSession(request)
  if (authError) return authError

  const { key } = await params
  if (!/^[a-f0-9-]+\.(pdf|jpg|jpeg|png)$/i.test(key)) {
    return NextResponse.json({ error: 'Documento inválido' }, { status: 400 })
  }

  try {
    const file = await getStorageProvider().read(key, 'private')
    return new NextResponse(file.body as BodyInit, {
      headers: { 'Content-Type': file.contentType, 'Content-Disposition': 'inline', 'Cache-Control': 'private, no-store' },
    })
  } catch {
    return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
  }
}
