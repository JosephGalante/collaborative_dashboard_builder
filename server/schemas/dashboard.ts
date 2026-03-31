import {z} from 'zod'

const dashboardNameSchema = z.string().max(100)
const widgetTitleSchema = z.string().max(80)

const dateRangeSchema = z.object({
  from: z.string().nullable(),
  to: z.string().nullable(),
})

const assetClassSchema = z.enum(['equities', 'fixed_income', 'cash', 'alternatives'])

export const globalFiltersSchema = z.object({
  dateRange: dateRangeSchema,
  assetClasses: z.array(assetClassSchema),
})

const widgetLayoutSchema = z.object({
  i: z.uuid(),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  minW: z.number().optional(),
  minH: z.number().optional(),
})

const lineConfigSchema = z.object({
  datasetKey: z.literal('portfolioTimeseries'),
  xField: z.literal('date'),
  yField: z.enum(['portfolioValue', 'netFlows']),
})

const barConfigSchema = z.object({
  datasetKey: z.literal('assetAllocation'),
  categoryField: z.literal('assetClass'),
  valueField: z.literal('marketValue'),
})

const statConfigSchema = z.object({
  datasetKey: z.literal('performanceStats'),
  statKey: z.enum(['totalValue', 'dailyChange', 'ytdReturnPct']),
  format: z.enum(['currency', 'percent', 'number']),
})

export const widgetSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.uuid(),
    title: widgetTitleSchema,
    type: z.literal('line'),
    config: lineConfigSchema,
  }),
  z.object({
    id: z.uuid(),
    title: widgetTitleSchema,
    type: z.literal('bar'),
    config: barConfigSchema,
  }),
  z.object({
    id: z.uuid(),
    title: widgetTitleSchema,
    type: z.literal('stat'),
    config: statConfigSchema,
  }),
])

export const updateDashboardRequestSchema = z
  .object({
    name: dashboardNameSchema,
    widgets: z.array(widgetSchema),
    layouts: z.array(widgetLayoutSchema),
    globalFilters: globalFiltersSchema,
  })
  .superRefine((data, ctx) => {
    const widgetIds = data.widgets.map((w) => w.id)
    const uniqueWidgetIds = new Set(widgetIds)
    if (uniqueWidgetIds.size !== widgetIds.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'Widget ids must be unique',
        path: ['widgets'],
      })
    }

    const layoutIds = data.layouts.map((l) => l.i)
    const uniqueLayoutIds = new Set(layoutIds)
    if (uniqueLayoutIds.size !== layoutIds.length) {
      ctx.addIssue({
        code: 'custom',
        message: 'Layout item ids must be unique',
        path: ['layouts'],
      })
    }

    for (const w of data.widgets) {
      if (!uniqueLayoutIds.has(w.id)) {
        ctx.addIssue({
          code: 'custom',
          message: `Widget ${w.id} has no matching layout item`,
          path: ['widgets'],
        })
      }
    }

    for (const l of data.layouts) {
      if (!uniqueWidgetIds.has(l.i)) {
        ctx.addIssue({
          code: 'custom',
          message: `Layout item ${l.i} has no matching widget`,
          path: ['layouts'],
        })
      }
    }
  })

export const createDashboardRequestSchema = z.object({
  name: dashboardNameSchema.optional(),
})

export type UpdateDashboardRequest = z.infer<typeof updateDashboardRequestSchema>
