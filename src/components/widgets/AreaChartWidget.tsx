import {useEffect, useMemo, useState} from 'react'
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts'
import type {AreaWidget, SeedDataset} from '@/types/widget'
import WidgetChartSkeleton from './WidgetChartSkeleton'
import WidgetEmptyState from './WidgetEmptyState'

type AreaChartWidgetProps = {
  widget: AreaWidget
  dataset: SeedDataset
}

export default function AreaChartWidget({widget, dataset}: AreaChartWidgetProps) {
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    const id = window.setTimeout(() => setShowSkeleton(false), 220)
    return () => window.clearTimeout(id)
  }, [widget.id])

  const points = useMemo(() => {
    const {xField, yField} = widget.config
    return dataset.portfolioTimeseries.map((row) => ({
      x: row[xField],
      y: row[yField],
    }))
  }, [dataset.portfolioTimeseries, widget.config])

  if (showSkeleton) return <WidgetChartSkeleton />
  if (points.length === 0) return <WidgetEmptyState message="No area chart data available." />

  return (
    <div className="h-full min-h-[120px] w-full min-w-0">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        minHeight={120}
        initialDimension={{width: 320, height: 180}}
      >
        <AreaChart data={points} margin={{top: 4, right: 8, left: 0, bottom: 0}}>
          <defs>
            <linearGradient id={`areaFill-${widget.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
          <XAxis
            dataKey="x"
            tick={{fill: '#a1a1aa', fontSize: 10}}
            tickLine={false}
            axisLine={{stroke: '#52525b'}}
            tickFormatter={(v) => String(v).slice(5)}
          />
          <YAxis
            tick={{fill: '#a1a1aa', fontSize: 10}}
            tickLine={false}
            axisLine={{stroke: '#52525b'}}
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
                new Intl.NumberFormat('en-US', {maximumFractionDigits: 0}).format(n),
                widget.config.yField === 'netFlows' ? 'Net flows' : 'Value',
              ]
            }}
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke="#22c55e"
            strokeWidth={2}
            fill={`url(#areaFill-${widget.id})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
