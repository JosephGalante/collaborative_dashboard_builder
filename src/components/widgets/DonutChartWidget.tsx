import {useEffect, useMemo, useState} from 'react'
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts'
import type {DonutWidget, SeedDataset} from '@/types/widget'
import {formatAssetClassLabel} from '@/lib/charts/formatStatValue'
import WidgetChartSkeleton from './WidgetChartSkeleton'
import WidgetEmptyState from './WidgetEmptyState'

const donutColors = ['#818cf8', '#22c55e', '#f59e0b', '#ec4899']

type DonutChartWidgetProps = {
  widget: DonutWidget
  dataset: SeedDataset
}

export default function DonutChartWidget({widget, dataset}: DonutChartWidgetProps) {
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    const id = window.setTimeout(() => setShowSkeleton(false), 220)
    return () => window.clearTimeout(id)
  }, [widget.id])

  const rows = useMemo(
    () =>
      dataset.assetAllocation.map((row) => ({
        name: formatAssetClassLabel(row.assetClass),
        value: row.marketValue,
      })),
    [dataset.assetAllocation],
  )

  if (showSkeleton) return <WidgetChartSkeleton />
  if (rows.length === 0) return <WidgetEmptyState message="No allocation data available." />

  return (
    <div className="flex h-full min-h-[120px] w-full min-w-0 items-center justify-center gap-3">
      <div className="h-full min-h-[140px] min-w-0 flex-1">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={140}
          initialDimension={{width: 280, height: 180}}
        >
          <PieChart>
            <Pie
              data={rows}
              dataKey="value"
              nameKey="name"
              innerRadius="52%"
              outerRadius="78%"
              paddingAngle={2}
            >
              {rows.map((row, index) => (
                <Cell key={row.name} fill={donutColors[index % donutColors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #3f3f46',
                borderRadius: '6px',
                fontSize: '12px',
              }}
              formatter={(value) => {
                const n = typeof value === 'number' ? value : Number(value)
                return [
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  }).format(n),
                  'Market value',
                ]
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-28 shrink-0 space-y-2 text-xs text-zinc-300">
        {rows.map((row, index) => (
          <div key={row.name} className="flex items-center gap-2">
            <span
              className="inline-block size-2.5 rounded-full"
              style={{backgroundColor: donutColors[index % donutColors.length]}}
            />
            <span className="truncate">{row.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
