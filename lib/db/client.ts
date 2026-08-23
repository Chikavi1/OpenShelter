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

  if (globalThis.__huellasPool) return globalThis.__huellasPool

  // Supabase pooler requiere SSL; sin esto da 28P01 aunque el pass sea correcto
  const needsSSL = connectionString.includes('supabase.co') || connectionString.includes('pooler.supabase')
  // En serverless (Netlify/Vercel) cada invocación puede crear un nuevo Pool.
  // Limitar `max` a 1-3 evita EMAXCONN (limit 200 en Supabase pooler) cuando hay concurrencia.
  const pool = new Pool({
    connectionString,
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    // Reutilizar conexiones y evitar fugas
    allowExitOnIdle: true,
    ...(needsSSL ? { ssl: { rejectUnauthorized: false } } : {}),
  })

  pool.on('error', (err) => {
    console.error('[db] pool error', err)
  })

  globalThis.__huellasPool = pool

  return pool
}

export function getDb() {
  return drizzle(getPool(), { schema })
}
