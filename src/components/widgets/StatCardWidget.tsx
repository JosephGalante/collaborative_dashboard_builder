import { useMemo, useState, useEffect } from 'react'
import type { SeedDataset, StatWidget } from '@/types/widget'
import { formatStatValue } from '@/lib/charts/formatStatValue'
import WidgetChartSkeleton from './WidgetChartSkeleton'
import WidgetEmptyState from './WidgetEmptyState'

type StatCardWidgetProps = {
  widget: StatWidget
  dataset: SeedDataset
}

export default function StatCardWidget({ widget, dataset }: StatCardWidgetProps) {
  const [showSkeleton, setShowSkeleton] = useState(true)

  useEffect(() => {
    const id = window.setTimeout(() => setShowSkeleton(false), 220)
    return () => window.clearTimeout(id)
  }, [widget.id])

  const value = useMemo(() => {
    const block = dataset.performanceStats
    return block[widget.config.statKey]
  }, [dataset.performanceStats, widget.config.statKey])

  if (showSkeleton) {
    return <WidgetChartSkeleton />
  }

  if (value === undefined || Number.isNaN(value)) {
    return <WidgetEmptyState message="Statistic is not available." />
  }

  const formatted = formatStatValue(value, widget.config.format)

  return (
    <div className="flex h-full min-h-[100px] flex-col justify-center rounded-md border border-zinc-800 bg-zinc-950/60 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {labelForStatKey(widget.config.statKey)}
      </p>
      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums tracking-tight text-zinc-100">
        {formatted}
      </p>
    </div>
  )
}

function labelForStatKey(key: StatWidget['config']['statKey']): string {
  switch (key) {
    case 'totalValue':
      return 'Total value'
    case 'dailyChange':
      return 'Daily change'
    case 'ytdReturnPct':
      return 'YTD return'
    default:
      return 'Value'
  }
}
