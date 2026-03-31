import type {FastifyPluginAsync} from 'fastify'
import {z} from 'zod'
import {pool, type DashboardRow} from '../db.js'
import {createDashboardRequestSchema, updateDashboardRequestSchema} from '../schemas/dashboard.js'

const idParamSchema = z.object({
  id: z.uuid(),
})

const defaultGlobalFilters = {
  dateRange: {from: null, to: null},
  assetClasses: [] as string[],
}

function rowToDashboard(row: DashboardRow) {
  return {
    id: row.id,
    name: row.name,
    widgets: row.widgets,
    layouts: row.layouts,
    globalFilters: row.global_filters,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

export const registerDashboardRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/dashboards', async (request, reply) => {
    const parsed = createDashboardRequestSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({error: 'Invalid body', details: parsed.error.flatten()})
    }

    const name = parsed.data.name ?? 'Untitled Dashboard'

    const result = await pool.query<DashboardRow>(
      `INSERT INTO dashboards (name, widgets, layouts, global_filters)
       VALUES ($1, $2::jsonb, $3::jsonb, $4::jsonb)
       RETURNING *`,
      [name, JSON.stringify([]), JSON.stringify([]), JSON.stringify(defaultGlobalFilters)],
    )

    const row = result.rows[0]
    if (!row) {
      return reply.status(500).send({error: 'Failed to create dashboard'})
    }

    return {dashboard: rowToDashboard(row)}
  })

  fastify.get('/dashboards/:id', async (request, reply) => {
    const params = idParamSchema.safeParse(request.params)
    if (!params.success) {
      return reply.status(400).send({error: 'Invalid id'})
    }

    const result = await pool.query<DashboardRow>(`SELECT * FROM dashboards WHERE id = $1`, [
      params.data.id,
    ])

    const row = result.rows[0]
    if (!row) {
      return reply.status(404).send({error: 'Dashboard not found'})
    }

    return {dashboard: rowToDashboard(row)}
  })

  fastify.put('/dashboards/:id', async (request, reply) => {
    const params = idParamSchema.safeParse(request.params)
    if (!params.success) {
      return reply.status(400).send({error: 'Invalid id'})
    }

    const parsed = updateDashboardRequestSchema.safeParse(request.body ?? {})
    if (!parsed.success) {
      return reply.status(400).send({error: 'Invalid body', details: parsed.error.flatten()})
    }

    const {name, widgets, layouts, globalFilters} = parsed.data

    const result = await pool.query<DashboardRow>(
      `UPDATE dashboards
       SET name = $1,
           widgets = $2::jsonb,
           layouts = $3::jsonb,
           global_filters = $4::jsonb,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [
        name,
        JSON.stringify(widgets),
        JSON.stringify(layouts),
        JSON.stringify(globalFilters),
        params.data.id,
      ],
    )

    const row = result.rows[0]
    if (!row) {
      return reply.status(404).send({error: 'Dashboard not found'})
    }

    return {dashboard: rowToDashboard(row)}
  })
}
