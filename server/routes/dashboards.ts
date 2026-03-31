import type {FastifyPluginAsync} from 'fastify'
import {z} from 'zod'
import {pool, type DashboardRow} from '../db.js'
import {createDashboardRequestSchema, updateDashboardRequestSchema} from '../schemas/dashboard.js'
import {notifyDashboardUpdated} from '../ws/presence.js'

const idParamSchema = z.object({
  id: z.uuid(),
})

const defaultGlobalFilters = {
  dateRange: {from: null, to: null},
  assetClasses: [] as string[],
}

function createStarterDashboard() {
  const lineValueId = crypto.randomUUID()
  const lineFlowsId = crypto.randomUUID()
  const areaTrendId = crypto.randomUUID()
  const barId = crypto.randomUUID()
  const donutId = crypto.randomUUID()
  const summaryId = crypto.randomUUID()
  const totalValueId = crypto.randomUUID()
  const dailyChangeId = crypto.randomUUID()
  const ytdReturnId = crypto.randomUUID()

  return {
    widgets: [
      {
        id: lineValueId,
        type: 'line',
        title: 'Portfolio Value',
        config: {
          datasetKey: 'portfolioTimeseries',
          xField: 'date',
          yField: 'portfolioValue',
        },
      },
      {
        id: lineFlowsId,
        type: 'line',
        title: 'Net Flows',
        config: {
          datasetKey: 'portfolioTimeseries',
          xField: 'date',
          yField: 'netFlows',
        },
      },
      {
        id: areaTrendId,
        type: 'area',
        title: 'Value Trend',
        config: {
          datasetKey: 'portfolioTimeseries',
          xField: 'date',
          yField: 'portfolioValue',
        },
      },
      {
        id: barId,
        type: 'bar',
        title: 'Asset Allocation',
        config: {
          datasetKey: 'assetAllocation',
          categoryField: 'assetClass',
          valueField: 'marketValue',
        },
      },
      {
        id: donutId,
        type: 'donut',
        title: 'Allocation Breakdown',
        config: {
          datasetKey: 'assetAllocation',
          categoryField: 'assetClass',
          valueField: 'marketValue',
        },
      },
      {
        id: summaryId,
        type: 'summary',
        title: 'Performance Summary',
        config: {
          datasetKey: 'performanceStats',
        },
      },
      {
        id: totalValueId,
        type: 'stat',
        title: 'Total Value',
        config: {
          datasetKey: 'performanceStats',
          statKey: 'totalValue',
          format: 'currency',
        },
      },
      {
        id: dailyChangeId,
        type: 'stat',
        title: 'Daily Change',
        config: {
          datasetKey: 'performanceStats',
          statKey: 'dailyChange',
          format: 'currency',
        },
      },
      {
        id: ytdReturnId,
        type: 'stat',
        title: 'YTD Return',
        config: {
          datasetKey: 'performanceStats',
          statKey: 'ytdReturnPct',
          format: 'percent',
        },
      },
    ],
    layouts: [
      {i: lineValueId, x: 0, y: 0, w: 6, h: 7, minW: 3, minH: 5},
      {i: lineFlowsId, x: 6, y: 0, w: 6, h: 7, minW: 3, minH: 5},
      {i: areaTrendId, x: 0, y: 7, w: 6, h: 7, minW: 3, minH: 5},
      {i: barId, x: 6, y: 7, w: 6, h: 7, minW: 3, minH: 5},
      {i: donutId, x: 0, y: 14, w: 4, h: 6, minW: 3, minH: 5},
      {i: summaryId, x: 4, y: 14, w: 8, h: 6, minW: 4, minH: 5},
      {i: totalValueId, x: 0, y: 20, w: 4, h: 5, minW: 3, minH: 5},
      {i: dailyChangeId, x: 4, y: 20, w: 4, h: 5, minW: 3, minH: 5},
      {i: ytdReturnId, x: 8, y: 20, w: 4, h: 5, minW: 3, minH: 5},
    ],
  }
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
    const starterDashboard = createStarterDashboard()

    const result = await pool.query<DashboardRow>(
      `INSERT INTO dashboards (name, widgets, layouts, global_filters)
       VALUES ($1, $2::jsonb, $3::jsonb, $4::jsonb)
       RETURNING *`,
      [
        name,
        JSON.stringify(starterDashboard.widgets),
        JSON.stringify(starterDashboard.layouts),
        JSON.stringify(defaultGlobalFilters),
      ],
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
    const sourceUserIdHeader = request.headers['x-actor-user-id']
    const sourceUserId =
      typeof sourceUserIdHeader === 'string' && sourceUserIdHeader.trim()
        ? sourceUserIdHeader
        : null

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

    notifyDashboardUpdated(params.data.id, {
      updatedAt: row.updated_at.toISOString(),
      sourceUserId,
    })

    return {dashboard: rowToDashboard(row)}
  })
}
