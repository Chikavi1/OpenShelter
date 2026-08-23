try { process.loadEnvFile() } catch {}
import { migrateDatabase, setupDatabase } from '../lib/db/setup'
import { seedDashboardState } from '../lib/dashboard-store'

const command = process.argv[2] ?? 'setup'

async function main() {
  switch (command) {
    case 'migrate':
      await migrateDatabase()
      return
    case 'seed':
      await seedDashboardState()
      return
    case 'setup':
    default:
      await setupDatabase()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
