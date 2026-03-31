import { useMemo, useState, useEffect } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { BarWidget, SeedDataset } from '@/types/widget'
import { formatAssetClassLabel } from '@/lib/charts/formatStatValue'
import WidgetChartSkeleton from './WidgetChartSkeleton'
import WidgetEmptyState from './WidgetEmptyState'

type BarChartWidgetProps = {
  widget: BarWidget
  dataset: SeedDataset
}

export default function BarChartWidget({ widget, dataset }: BarChartWidgetProps) {
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    const id = window.setTimeout(() => setShowSkeleton(false), 220)
    return () => window.clearTimeout(id)
  }, [widget.id])

  const rows = useMemo(() => {
    const { categoryField, valueField } = widget.config
    return dataset.assetAllocation.map((row) => ({
      name: formatAssetClassLabel(String(row[categoryField])),
      value: row[valueField],
    }))
  }, [dataset.assetAllocation, widget.config])

  if (showSkeleton) {
    return <WidgetChartSkeleton />
  }

  if (rows.length === 0) {
    return <WidgetEmptyState message="No allocation rows available." />
  }

  return (
    <div className="h-full min-h-[120px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#a1a1aa', fontSize: 9 }}
            tickLine={false}
            axisLine={{ stroke: '#52525b' }}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={48}
          />
          <YAxis
            tick={{ fill: '#a1a1aa', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: '#52525b' }}
            tickFormatter={(v) =>
              v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}k`
            }
            width={40}
          />
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
          <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
