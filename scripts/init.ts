try { process.loadEnvFile() } catch {}
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { existsSync, readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { randomBytes } from 'node:crypto'
import path from 'node:path'

const rl = createInterface({ input, output })

function argFlag(name: string) {
  return process.argv.includes(`--${name}`)
}

async function ask(question: string, defaultValue?: string, opts?: { hidden?: boolean; required?: boolean }) {
  const hint = defaultValue ? ` [${opts?.hidden ? '••••••' : defaultValue}]` : ''
  const answer = await rl.question(`${question}${hint}: `)
  const value = answer.trim() === '' && defaultValue !== undefined ? defaultValue : answer.trim()
  if (opts?.required && !value) {
    console.log('  → valor requerido')
    return ask(question, defaultValue, opts)
  }
  return value
}

async function main() {
  const isYes = argFlag('yes') || argFlag('y')

  console.log('\n🐾  OpenShelter — Asistente de configuración inicial\n')
  console.log('Este wizard te guiará como `ionic start` para dejar .env listo y correr migraciones.\n')

  const envPath = path.join(process.cwd(), '.env')
  const envExists = existsSync(envPath)
  if (envExists && !isYes) {
    const overwrite = (await ask('Ya existe .env ¿sobrescribir? (s/N)', 'N')).toLowerCase()
    if (!['s', 'si', 'y', 'yes'].includes(overwrite)) {
      console.log('→ Conservando .env existente. Solo se preguntará por DB/setup.\n')
    }
  }

  // Cargar defaults de .env.example si existe
  let exampleDefaults: Record<string, string> = {}
  const examplePath = path.join(process.cwd(), '.env.example')
  if (existsSync(examplePath)) {
    const raw = readFileSync(examplePath, 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/)
      if (m) exampleDefaults[m[1]] = m[2]
    }
  }

  const generatedSecret = randomBytes(32).toString('base64url')

  // === 1. Datos del refugio (públicos) ===
  console.log('── Datos del refugio ──────────────────')
  const appName = isYes ? exampleDefaults.NEXT_PUBLIC_APP_NAME || 'Refugio Huellas' : await ask('Nombre del refugio', exampleDefaults.NEXT_PUBLIC_APP_NAME || 'Refugio Huellas', { required: true })
  const contactEmail = isYes ? exampleDefaults.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@refugiohuellas.org' : await ask('Email público de contacto', exampleDefaults.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@refugiohuellas.org')
  const contactPhone = isYes ? exampleDefaults.NEXT_PUBLIC_CONTACT_PHONE || '+52 55 1234 5678' : await ask('Teléfono público', exampleDefaults.NEXT_PUBLIC_CONTACT_PHONE || '+52 55 1234 5678')
  const contactAddress = isYes ? exampleDefaults.NEXT_PUBLIC_CONTACT_ADDRESS || 'Calle del Amor 123, CDMX' : await ask('Dirección pública', exampleDefaults.NEXT_PUBLIC_CONTACT_ADDRESS || 'Calle del Amor 123, CDMX')
  const contactHours = isYes ? exampleDefaults.NEXT_PUBLIC_CONTACT_HOURS || 'Lun-Sáb 10:00-17:00' : await ask('Horario de visitas', exampleDefaults.NEXT_PUBLIC_CONTACT_HOURS || 'Lun-Sáb 10:00-17:00')

  // === 2. Base de datos y auth ===
  console.log('\n── Base de datos y admin ──────────────')
  const databaseUrl = isYes ? exampleDefaults.DATABASE_URL : await ask('DATABASE_URL', exampleDefaults.DATABASE_URL || 'postgresql://huellas:huellas@localhost:5432/huellas?schema=public', { required: true })
  const authSecret = isYes ? generatedSecret : await ask('AUTH_SECRET (vacío = generar)', generatedSecret)
  const adminEmail = isYes ? exampleDefaults.ADMIN_EMAIL || 'admin@huellas.org' : await ask('ADMIN_EMAIL (login dashboard)', exampleDefaults.ADMIN_EMAIL || 'admin@huellas.org', { required: true })
  const adminPassword = isYes ? exampleDefaults.ADMIN_PASSWORD || 'change-me-now' : await ask('ADMIN_PASSWORD', exampleDefaults.ADMIN_PASSWORD || 'change-me-now', { required: true })

  // === 3. Storage ===
  console.log('\n── Almacenamiento ─────────────────────')
  const storageDriver = isYes ? exampleDefaults.STORAGE_DRIVER || 'local' : await ask('STORAGE_DRIVER (local / s3)', exampleDefaults.STORAGE_DRIVER || 'local')
  let s3Answers: Record<string, string> = {}
  if (storageDriver === 's3') {
    s3Answers.S3_ENDPOINT = isYes ? exampleDefaults.S3_ENDPOINT : await ask('S3_ENDPOINT', exampleDefaults.S3_ENDPOINT || 'https://s3.amazonaws.com')
    s3Answers.S3_REGION = isYes ? exampleDefaults.S3_REGION : await ask('S3_REGION', exampleDefaults.S3_REGION || 'us-east-1')
    s3Answers.S3_BUCKET = isYes ? exampleDefaults.S3_BUCKET : await ask('S3_BUCKET', exampleDefaults.S3_BUCKET || 'huellas')
    s3Answers.S3_ACCESS_KEY_ID = isYes ? exampleDefaults.S3_ACCESS_KEY_ID : await ask('S3_ACCESS_KEY_ID', exampleDefaults.S3_ACCESS_KEY_ID || '')
    s3Answers.S3_SECRET_ACCESS_KEY = isYes ? exampleDefaults.S3_SECRET_ACCESS_KEY : await ask('S3_SECRET_ACCESS_KEY', exampleDefaults.S3_SECRET_ACCESS_KEY || '')
    s3Answers.S3_FORCE_PATH_STYLE = isYes ? exampleDefaults.S3_FORCE_PATH_STYLE : await ask('S3_FORCE_PATH_STYLE', exampleDefaults.S3_FORCE_PATH_STYLE || 'false')
    s3Answers.S3_PUBLIC_URL = isYes ? exampleDefaults.S3_PUBLIC_URL : await ask('S3_PUBLIC_URL', exampleDefaults.S3_PUBLIC_URL || '')
  }

  // === 4. Escribir .env ===
  const envContent = [
    `NEXT_PUBLIC_APP_NAME="${appName}"`,
    `NEXT_PUBLIC_LOGO_URL="${exampleDefaults.NEXT_PUBLIC_LOGO_URL || ''}"`,
    `NEXT_PUBLIC_CONTACT_EMAIL="${contactEmail}"`,
    `NEXT_PUBLIC_CONTACT_PHONE="${contactPhone}"`,
    `NEXT_PUBLIC_CONTACT_ADDRESS="${contactAddress}"`,
    `NEXT_PUBLIC_CONTACT_HOURS="${contactHours}"`,
    ``,
    `DATABASE_URL="${databaseUrl}"`,
    `AUTH_SECRET="${authSecret || generatedSecret}"`,
    `ADMIN_EMAIL="${adminEmail}"`,
    `ADMIN_PASSWORD="${adminPassword}"`,
    ``,
    `STORAGE_DRIVER="${storageDriver}"`,
    `STORAGE_LOCAL_DIR="${exampleDefaults.STORAGE_LOCAL_DIR || 'public/uploads'}"`,
    `STORAGE_PUBLIC_BASE_URL="${exampleDefaults.STORAGE_PUBLIC_BASE_URL || '/uploads'}"`,
    ``,
    `S3_ENDPOINT="${s3Answers.S3_ENDPOINT || exampleDefaults.S3_ENDPOINT || ''}"`,
    `S3_REGION="${s3Answers.S3_REGION || exampleDefaults.S3_REGION || 'us-east-1'}"`,
    `S3_BUCKET="${s3Answers.S3_BUCKET || exampleDefaults.S3_BUCKET || ''}"`,
    `S3_ACCESS_KEY_ID="${s3Answers.S3_ACCESS_KEY_ID || exampleDefaults.S3_ACCESS_KEY_ID || ''}"`,
    `S3_SECRET_ACCESS_KEY="${s3Answers.S3_SECRET_ACCESS_KEY || exampleDefaults.S3_SECRET_ACCESS_KEY || ''}"`,
    `S3_FORCE_PATH_STYLE="${s3Answers.S3_FORCE_PATH_STYLE || exampleDefaults.S3_FORCE_PATH_STYLE || 'false'}"`,
    `S3_PUBLIC_URL="${s3Answers.S3_PUBLIC_URL || exampleDefaults.S3_PUBLIC_URL || ''}"`,
    ``,
  ].join('\n')

  const shouldWrite = isYes ? true : (await ask(`\n¿Escribir .env en ${envPath}? (S/n)`, 'S')).toLowerCase() !== 'n'
  if (shouldWrite) {
    await writeFile(envPath, envContent, 'utf8')
    console.log(`\n✔ .env escrito en ${envPath}`)
    // Inyectar en process.env para el paso de migraciones sin reiniciar
    for (const line of envContent.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/)
      if (m) process.env[m[1]] = m[2]
    }
  } else {
    console.log('→ .env no modificado')
  }

  // === 5. Migraciones ===
  console.log('\n── Base de datos ──────────────────────')
  const runMigrate = isYes ? true : (await ask('¿Correr migraciones ahora? (S/n)', 'S')).toLowerCase() !== 'n'
  const seedDemo = isYes ? true : (await ask('¿Cargar datos demo (mascotas/settings) si la DB está vacía? (S/n)', 'S')).toLowerCase() !== 'n'

  if (runMigrate) {
    console.log('\n→ Ejecutando migraciones...')
    try {
      const { migrateDatabase } = await import('../lib/db/setup.js')
      await migrateDatabase()
      console.log('✔ Migraciones aplicadas')

      if (seedDemo) {
        const { seedDashboardState } = await import('../lib/dashboard-store.js')
        await seedDashboardState()
        console.log('✔ Seed verificado (solo si DB vacía)')

        // Si el usuario dio un nombre/email distinto al default, actualizar shelter_settings
        if (appName !== 'Refugio Huellas' || contactEmail !== 'contacto@refugiohuellas.org') {
          const { getPool } = await import('../lib/db/client.js')
          const pool = getPool()
          await pool.query(
            `UPDATE shelter_settings SET name = $1, email = $2, phone = $3, address = $4 WHERE id = 1`,
            [appName, contactEmail, contactPhone, contactAddress]
          )
          console.log('✔ shelter_settings actualizado con datos del wizard')
        }
      }

      console.log('\n✅ ¡Listo! Corre `npm run dev` y abre http://localhost:3000')
      console.log(`   Login admin: ${adminEmail}`)
    } catch (e) {
      console.error('\n✘ Error al migrar:', e)
      console.log('Revisa DATABASE_URL y que Postgres esté corriendo, luego reintenta con: npm run db:setup')
    }
  } else {
    console.log('\n→ Omitiendo migraciones. Cuando quieras correrlas manual:')
    console.log('  npm run db:migrate   # solo migraciones')
    console.log('  npm run db:seed      # solo seed (si DB vacía)')
    console.log('  npm run db:setup     # migraciones + seed')
  }

  rl.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
