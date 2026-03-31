import Fastify from 'fastify'
import cors from '@fastify/cors'
import {pool, ensureSchema} from './db.js'
import {registerDashboardRoutes} from './routes/dashboards.js'
import {registerPresenceSocket} from './ws/presence.js'

async function main() {
  await ensureSchema()

  const app = Fastify({logger: true})
  const corsOrigin = process.env.CORS_ORIGIN?.trim()
  await app.register(cors, {origin: corsOrigin ? corsOrigin : true})

  app.get('/healthz', async () => ({ok: true}))

  app.get('/readyz', async (_request, reply) => {
    try {
      await pool.query('SELECT 1')
      return {ok: true}
    } catch {
      return reply.status(503).send({ok: false})
    }
  })

  await app.register(registerDashboardRoutes, {prefix: '/api'})
  await app.register(registerPresenceSocket)

  const host = process.env.HOST || '0.0.0.0'
  const port = Number(process.env.PORT) || 3333
  await app.listen({port, host})
  console.log(`[server] listening on http://${host}:${port}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
