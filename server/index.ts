import Fastify from 'fastify'
import cors from '@fastify/cors'
import { ensureSchema } from './db.js'
import { registerDashboardRoutes } from './routes/dashboards.js'

async function main() {
  await ensureSchema()

  const app = Fastify({ logger: true })
  await app.register(cors, { origin: true })
  await app.register(registerDashboardRoutes, { prefix: '/api' })

  const port = Number(process.env.PORT) || 3333
  await app.listen({ port, host: '0.0.0.0' })
  console.log(`[server] listening on http://localhost:${port}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
