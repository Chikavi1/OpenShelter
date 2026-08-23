import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

declare global {
  var __huellasPool: Pool | undefined
}

export function getPool() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is required')
  }

  // Supabase pooler requiere SSL; sin esto da 28P01 aunque el pass sea correcto
  const needsSSL = connectionString.includes('supabase.co') || connectionString.includes('pooler.supabase')
  const pool = globalThis.__huellasPool ?? new Pool({ 
    connectionString,
    ...(needsSSL ? { ssl: { rejectUnauthorized: false } } : {}),
  })

  if (process.env.NODE_ENV !== 'production') {
    globalThis.__huellasPool = pool
  }

  return pool
}

export function getDb() {
  return drizzle(getPool(), { schema })
}
