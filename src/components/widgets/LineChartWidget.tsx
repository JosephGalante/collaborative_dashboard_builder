import { useMemo, useState, useEffect } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { LineWidget, SeedDataset } from '@/types/widget'
import WidgetChartSkeleton from './WidgetChartSkeleton'
import WidgetEmptyState from './WidgetEmptyState'

type LineChartWidgetProps = {
  widget: LineWidget
  dataset: SeedDataset
}

export default function LineChartWidget({ widget, dataset }: LineChartWidgetProps) {
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    const id = window.setTimeout(() => setShowSkeleton(false), 220)
    return () => window.clearTimeout(id)
  }, [widget.id])

  const points = useMemo(() => {
    const rows = dataset.portfolioTimeseries
    const { xField, yField } = widget.config
    return rows.map((row) => ({
      x: row[xField],
      y: row[yField],
    }))
  }, [dataset.portfolioTimeseries, widget.config])

  if (showSkeleton) {
    return <WidgetChartSkeleton />
  }

  if (points.length === 0) {
    return <WidgetEmptyState message="No time series data available." />
  }

  return (
    <div className="h-full min-h-[120px] w-full min-w-0">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        minHeight={120}
        initialDimension={{ width: 320, height: 180 }}
      >
        <LineChart data={points} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
          <XAxis
            dataKey="x"
            tick={{ fill: '#a1a1aa', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: '#52525b' }}
            tickFormatter={(v) => String(v).slice(5)}
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
            labelStyle={{ color: '#e4e4e7' }}
            formatter={(value) => {
              const n = typeof value === 'number' ? value : Number(value)
              const formatted =
                widget.config.yField === 'portfolioValue'
                  ? new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                    }).format(n)
                  : new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)
              return [formatted, widget.config.yField === 'netFlows' ? 'Net flows' : 'Value']
            }}
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#818cf8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#a5b4fc' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
