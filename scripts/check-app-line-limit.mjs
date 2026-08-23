import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve('app')
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx'])
const offenders = []

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      await visit(filePath)
      continue
    }

    if (!extensions.has(path.extname(entry.name))) continue

    const lines = (await readFile(filePath, 'utf8')).split('\n').length
    if (lines > 1000) offenders.push(`${path.relative(process.cwd(), filePath)}: ${lines} líneas`)
  }
}

await visit(root)

if (offenders.length) {
  console.error('Archivos dentro de app que superan el límite de 1000 líneas:')
  console.error(offenders.join('\n'))
  process.exit(1)
}

console.log('Límite de 1000 líneas respetado en todos los archivos de app/.')
