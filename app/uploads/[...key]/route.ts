import { NextResponse } from 'next/server'
import { getStorageProvider } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params
  const safeKey = key.join('/')

  if (!safeKey || safeKey.split('/').some((segment) => segment === '..' || segment.includes('\\'))) {
    return new NextResponse('Not Found', { status: 404 })
  }

  try {
    const file = await getStorageProvider().read(safeKey)
    return new NextResponse(file.body, {
      headers: {
        'Content-Type': file.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
}