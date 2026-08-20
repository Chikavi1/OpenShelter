import type { NextRequest } from 'next/server'

export const SESSION_COOKIE = 'huellas_admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 8

export interface SessionPayload {
  email: string
  exp: number
}

function getSecret() {
  return process.env.AUTH_SECRET ?? ''
}

function encoder() {
  return new TextEncoder()
}

function decoder() {
  return new TextDecoder()
}

function toBase64Url(value: Uint8Array) {
  let binary = ''
  for (const byte of value) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  const normalized = `${padded}${'='.repeat((4 - (padded.length % 4)) % 4)}`
  const binary = atob(normalized)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

async function importSigningKey(secret: string) {
  return crypto.subtle.importKey('raw', encoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

async function sign(secret: string, value: string) {
  const key = await importSigningKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, encoder().encode(value))
  return toBase64Url(new Uint8Array(signature))
}

function safeJsonParse(value: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(decoder().decode(fromBase64Url(value))) as SessionPayload
    if (!parsed?.email || typeof parsed.exp !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

export function normalizeAdminEmail(email: string) {
  return email.trim().toLowerCase()
}

export function areAdminCredentialsValid(email: string, password: string) {
  const expectedEmail = normalizeAdminEmail(process.env.ADMIN_EMAIL ?? '')
  const expectedPassword = process.env.ADMIN_PASSWORD ?? ''
  return normalizeAdminEmail(email) === expectedEmail && password === expectedPassword && expectedEmail.length > 0 && expectedPassword.length > 0
}

export async function createSessionToken(email: string) {
  const payload: SessionPayload = {
    email: normalizeAdminEmail(email),
    exp: Date.now() + SESSION_TTL_MS,
  }
  const serialized = toBase64Url(encoder().encode(JSON.stringify(payload)))
  const signature = await sign(getSecret(), serialized)
  return `${serialized}.${signature}`
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return null

  const secret = getSecret()
  if (!secret) return null

  const [serialized, signature] = token.split('.')
  if (!serialized || !signature) return null

  const expectedSignature = await sign(secret, serialized)
  if (signature !== expectedSignature) return null

  const payload = safeJsonParse(serialized)
  if (!payload || payload.exp <= Date.now()) return null

  return payload
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  }
}

export async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  return Boolean(await verifySessionToken(token))
}
