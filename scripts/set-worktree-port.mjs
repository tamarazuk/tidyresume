import { readFile, writeFile } from 'node:fs/promises'
import net from 'node:net'
import path from 'node:path'

const WORKTREE_PORT_START = 3300
const PORT_SCAN_END = 3999

function parseArgs() {
  const args = process.argv.slice(2)
  const portIndex = args.indexOf('--port')
  if (portIndex !== -1 && args[portIndex + 1]) {
    return Number(args[portIndex + 1])
  }
  return undefined
}

async function isPortFree(port) {
  return await new Promise((resolve) => {
    const server = net.createServer()

    server.once('error', () => resolve(false))
    server.once('listening', () => {
      server.close(() => resolve(true))
    })

    server.listen(port, '127.0.0.1')
  })
}

async function findAvailablePort(start, end = PORT_SCAN_END) {
  for (let port = start; port <= end; port += 1) {
    if (await isPortFree(port)) {
      return port
    }
  }

  throw new Error(`No available port between ${start} and ${end}`)
}

function updateEnvLines(lines, updates) {
  const remaining = new Set(Object.keys(updates))

  const nextLines = lines.map((line) => {
    const match = line.match(/^([A-Z0-9_]+)=/)
    if (!match) {
      return line
    }

    const key = match[1]
    if (!(key in updates)) {
      return line
    }

    remaining.delete(key)
    return `${key}=${updates[key]}`
  })

  for (const key of remaining) {
    nextLines.push(`${key}=${updates[key]}`)
  }

  return nextLines
}

async function readEnvFile(envPath) {
  try {
    const content = await readFile(envPath, 'utf8')
    return content.split(/\r?\n/)
  } catch {
    return []
  }
}

async function main() {
  const requestedPort = parseArgs() || (process.env.PORT ? Number(process.env.PORT) : undefined)
  const port = requestedPort ?? await findAvailablePort(WORKTREE_PORT_START)

  if (!(await isPortFree(port))) {
    throw new Error(`Port ${port} is already in use. Pick another port.`)
  }

  const baseUrl = `http://localhost:${port}`
  const envPath = path.join(process.cwd(), '.env.local')
  const lines = await readEnvFile(envPath)

  const updated = updateEnvLines(lines, {
    PORT: String(port),
    NEXT_PUBLIC_APP_URL: baseUrl,
  })

  if (updated.length === 0 || updated[updated.length - 1] !== '') {
    updated.push('')
  }

  await writeFile(envPath, updated.join('\n'), 'utf8')
  console.log(`Saved PORT=${port} and NEXT_PUBLIC_APP_URL=${baseUrl} to .env.local`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
