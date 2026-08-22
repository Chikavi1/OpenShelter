import { NextResponse } from 'next/server'
import { areAdminCredentialsValid, createSessionToken, sessionCookieOptions, SESSION_COOKIE } from '@/lib/auth'

export async function POST(request: Request) {
  const { email, password } = await request.json().catch(() => ({ email: '', password: '' })) as { email?: string; password?: string }

  if (!areAdminCredentialsValid(email ?? '', password ?? '')) {
    return NextResponse.json({ ok: false, error: 'Credenciales inválidas' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, await createSessionToken(email ?? ''), sessionCookieOptions())
  return response
}
