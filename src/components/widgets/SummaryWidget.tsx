import {useEffect, useMemo, useState} from 'react'
import type {SeedDataset, SummaryWidget} from '@/types/widget'
import {formatStatValue} from '@/lib/charts/formatStatValue'
import WidgetChartSkeleton from './WidgetChartSkeleton'
import WidgetEmptyState from './WidgetEmptyState'

type SummaryWidgetProps = {
  widget: SummaryWidget
  dataset: SeedDataset
}

export default function SummaryWidget({widget, dataset}: SummaryWidgetProps) {
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    const id = window.setTimeout(() => setShowSkeleton(false), 220)
    return () => window.clearTimeout(id)
  }, [widget.id])

  const stats = useMemo(() => {
    const block = dataset.performanceStats
    return [
      {label: 'Total Value', value: formatStatValue(block.totalValue, 'currency')},
      {label: 'Daily Change', value: formatStatValue(block.dailyChange, 'currency')},
      {label: 'YTD Return', value: formatStatValue(block.ytdReturnPct, 'percent')},
    ]
  }, [dataset.performanceStats])

  if (showSkeleton) return <WidgetChartSkeleton />
  if (stats.length === 0) return <WidgetEmptyState message="No summary data available." />

  return (
    <div className="grid h-full min-h-[120px] grid-cols-1 gap-3 md:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-md border border-zinc-800 bg-zinc-950/60 px-4 py-3"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{stat.label}</p>
          <p className="mt-2 font-mono text-xl font-semibold tracking-tight text-zinc-100">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}
