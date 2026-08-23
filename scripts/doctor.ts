try { process.loadEnvFile() } catch {}
import { existsSync, statSync } from 'node:fs'
import { readdir, mkdir, writeFile, rm, access } from 'node:fs/promises'
import path from 'node:path'

type Check = { name: string; ok: boolean; warn?: boolean; msg: string }

const checks: Check[] = []
const ok = (name: string, msg: string) => checks.push({ name, ok: true, msg })
const fail = (name: string, msg: string) => checks.push({ name, ok: false, msg })
const warn = (name: string, msg: string) => checks.push({ name, ok: false, warn: true, msg })

async function main() {
  console.log('\n🩺  OpenShelter — Doctor\n')

  // 1. .env
  const envPath = path.join(process.cwd(), '.env')
  if (existsSync(envPath)) ok('.env', `encontrado (${envPath})`)
  else fail('.env', 'no existe — corre `npm run init` o copia .env.example')

  // 2. Env vars requeridas
  const required = ['DATABASE_URL', 'AUTH_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'] as const
  for (const k of required) {
    const v = process.env[k]
    if (!v) fail(`env:${k}`, 'vacío / no definido')
    else if (k === 'AUTH_SECRET' && v.length < 32) warn(`env:${k}`, `muy corto (${v.length} chars), genera uno con \`openssl rand -base64 32\``)
    else if (k === 'ADMIN_PASSWORD' && v.length < 8) warn(`env:${k}`, `débil (<8 chars)`)
    else ok(`env:${k}`, v.slice(0, 3) + '***' + ` (${v.length} chars)`)
  }
  const publics = ['NEXT_PUBLIC_APP_NAME', 'NEXT_PUBLIC_CONTACT_EMAIL'] as const
  for (const k of publics) {
    if (!process.env[k]) warn(`env:${k}`, 'vacío — el sitio mostrará defaults')
    else ok(`env:${k}`, process.env[k]!)
  }

  // 3. DATABASE_URL parse
  let dbUrl: URL | null = null
  try {
    dbUrl = new URL(process.env.DATABASE_URL ?? '')
    ok('DATABASE_URL parse', `${dbUrl.username}@${dbUrl.hostname}:${dbUrl.port || '5432'} / ${dbUrl.pathname.slice(1)}`)
    if (!dbUrl.pathname || dbUrl.pathname === '/') warn('DATABASE_URL', 'sin database name en pathname')
  } catch {
    fail('DATABASE_URL parse', 'URL inválida')
  }

  // 4. Conexión DB
  if (dbUrl) {
    try {
      const { getPool } = await import('../lib/db/client.js')
      const pool = getPool()
      const t0 = Date.now()
      await pool.query('SELECT 1 as ok')
      const ms = Date.now() - t0
      ok('DB conexión', `SELECT 1 ok en ${ms}ms ${dbUrl.hostname.includes('supabase') ? '(SSL auto)' : ''}`)

      // migrations
      try {
        const files = (await readdir(path.join(process.cwd(), 'migrations'))).filter(f => f.endsWith('.sql')).sort()
        const { rows } = await pool.query('SELECT filename FROM schema_migrations ORDER BY filename')
        const applied = new Set(rows.map((r: any) => r.filename))
        const pending = files.filter(f => !applied.has(f))
        if (pending.length === 0) ok('DB migraciones', `${applied.size}/${files.length} aplicadas`)
        else fail('DB migraciones', `pendientes: ${pending.join(', ')} — corre \`npm run db:migrate\``)
      } catch (e: any) {
        fail('DB migraciones', e.message?.slice(0, 120))
      }

      // tablas core
      const coreTables = ['pets', 'adoption_applications', 'shelter_settings', 'shelter_events']
      for (const t of coreTables) {
        try {
          const { rows } = await pool.query(`SELECT to_regclass('public.${t}') as oid`)
          if (rows[0]?.oid) ok(`DB tabla:${t}`, 'existe')
          else fail(`DB tabla:${t}`, 'no existe — falta migración')
        } catch (e: any) { fail(`DB tabla:${t}`, e.message) }
      }

      // conteos
      try {
        const c1 = await pool.query('SELECT count(*) as c FROM pets')
        const c2 = await pool.query('SELECT count(*) as c FROM shelter_settings WHERE id=1')
        ok('DB datos', `pets=${c1.rows[0].c}, shelter_settings=${c2.rows[0].c} ${c2.rows[0].c === '0' ? '(vacío — corre db:seed)' : ''}`)
      } catch {}

      // no cerrar pool global para no romper hot-reload, pero si es script sí
      // await pool.end() // lo dejamos vivo si es reutilizado
    } catch (e: any) {
      fail('DB conexión', `${e.code ?? ''} ${e.message?.slice(0, 180)}`)
      if (e.code === '28P01') {
        console.log('   → tip: en Supabase usa usuario `postgres.<project_ref>` y pooler `aws-0-*.pooler.supabase.com:6543?pgbouncer=true`, resetea el password en Dashboard > Database')
      }
      if (e.code === 'ENOTFOUND' || e.code === 'ECONNREFUSED') {
        console.log('   → tip: verifica DATABASE_URL y que Postgres esté accesible')
      }
    }
  }

  // 5. Storage — petición real (no solo env)
  const driver = (process.env.STORAGE_DRIVER ?? 'local').toLowerCase()
  ok('STORAGE_DRIVER', driver)
  if (driver === 'local') {
    const dir = path.join(process.cwd(), process.env.STORAGE_LOCAL_DIR ?? 'public/uploads')
    const base = process.env.STORAGE_PUBLIC_BASE_URL ?? '/uploads'
    try {
      await access(dir).catch(async () => { await mkdir(dir, { recursive: true }) })
      // test directo filesystem
      const testFile = path.join(dir, '.doctor-test')
      await writeFile(testFile, 'ok')
      await rm(testFile, { force: true })
      const st = statSync(dir)
      ok('Storage local FS', `escribible ${dir} (base URL ${base})`)
    } catch (e: any) {
      fail('Storage local FS', `no escribible: ${dir} — ${e.message}`)
    }
    // test vía provider real (misma ruta que la app) lib/storage.ts:54
    try {
      const { getStorageProvider } = await import('../lib/storage.js')
      const provider = getStorageProvider()
      const t0 = Date.now()
      const uploaded = await provider.upload({ filename: 'doctor-test.txt', body: Buffer.from(`doctor-${Date.now()}`), contentType: 'text/plain' })
      const read = await provider.read(uploaded.key)
      if (!read.body.length) throw new Error('read vacío')
      await provider.remove(uploaded.key)
      ok('Storage local petición', `upload/read/remove ok en ${Date.now() - t0}ms url=${uploaded.url.slice(0, 70)}`)
    } catch (e: any) {
      fail('Storage local petición', `${e.message?.slice(0, 200)} — revisa STORAGE_LOCAL_DIR y permisos`)
    }
  } else if (driver === 's3') {
    const bucket = process.env.S3_BUCKET
    const region = process.env.S3_REGION
    const endpoint = process.env.S3_ENDPOINT
    if (!bucket) fail('Storage S3 bucket', 'S3_BUCKET vacío')
    else ok('Storage S3 bucket', bucket)
    if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) fail('Storage S3 creds', 'S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY vacíos — S3 devolverá 403')
    else ok('Storage S3 creds', 'presentes')

    // petición real vía S3Client + vía provider de la app lib/storage.ts:89
    if (bucket && process.env.S3_ACCESS_KEY_ID) {
      try {
        const { S3Client, HeadBucketCommand } = await import('@aws-sdk/client-s3')
        const client = new S3Client({
          region: region ?? 'us-east-1',
          endpoint: endpoint,
          credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! },
          forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
        })
        const t0 = Date.now()
        await client.send(new HeadBucketCommand({ Bucket: bucket }))
        ok('Storage S3 conexión', `HeadBucket ok en ${endpoint ?? 'aws'} / ${bucket} (${Date.now() - t0}ms)`)
      } catch (e: any) {
        fail('Storage S3 conexión', `${e.name ?? ''} ${e.message?.slice(0, 220)} — revisa S3_BUCKET/ENDPOINT/creds`)
      }
      // test end-to-end upload/read/delete con el provider real
      try {
        const { getStorageProvider } = await import('../lib/storage.js')
        const provider = getStorageProvider()
        const t0 = Date.now()
        const uploaded = await provider.upload({ filename: 'doctor-test.txt', body: Buffer.from(`doctor-${Date.now()}`), contentType: 'text/plain' })
        const read = await provider.read(uploaded.key)
        if (!read.body.length) throw new Error('read vacío')
        await provider.remove(uploaded.key)
        ok('Storage S3 escritura', `upload/read/remove ok en ${Date.now() - t0}ms url=${uploaded.url.slice(0, 70)}`)
      } catch (e: any) {
        fail('Storage S3 escritura', `${e.message?.slice(0, 220)} — revisa permisos bucket/policy`)
      }
    }
  } else {
    warn('STORAGE_DRIVER', `valor desconocido "${driver}" — usa local o s3`)
  }

  // 6. Resumen
  console.log('\n' + checks.map(c => {
    const icon = c.ok ? '✔' : c.warn ? '⚠' : '✘'
    const color = c.ok ? '\x1b[32m' : c.warn ? '\x1b[33m' : '\x1b[31m'
    return `${color}${icon}\x1b[0m ${c.name.padEnd(22)} ${c.msg}`
  }).join('\n'))

  const fails = checks.filter(c => !c.ok && !c.warn).length
  const warns = checks.filter(c => c.warn).length
  console.log(`\n${fails === 0 ? '\x1b[32m✔ Todo OK' : `\x1b[31m✘ ${fails} error(es)`}\x1b[0m${warns ? `, \x1b[33m${warns} advertencia(s)\x1b[0m` : ''}`)
  if (fails) console.log('Corrige los ✘ y vuelve a correr `npm run doctor`\n')
  else console.log('Puedes correr `npm run dev` y abrir http://localhost:3000\n')
  process.exit(fails ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
