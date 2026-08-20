import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPool } from './client'
import { seedDashboardState } from '../dashboard-store'

let readyPromise: Promise<void> | null = null

async function ensureMigrationsTable() {
  const pool = getPool()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

export async function migrateDatabase() {
  const pool = getPool()
  await ensureMigrationsTable()

  const migrationDir = path.join(process.cwd(), 'migrations')
  const files = (await readdir(migrationDir)).filter((file) => file.endsWith('.sql')).sort()
  const appliedRows = await pool.query('SELECT filename FROM schema_migrations')
  const applied = new Set(appliedRows.rows.map((row) => (row as { filename: string }).filename))

  for (const file of files) {
    if (applied.has(file)) continue

    const migrationSql = await readFile(path.join(migrationDir, file), 'utf8')
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(migrationSql)
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file])
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
}

export async function setupDatabase() {
  if (!readyPromise) {
    readyPromise = (async () => {
      await migrateDatabase()
      await seedDashboardState()
    })()
  }

  return readyPromise
}
