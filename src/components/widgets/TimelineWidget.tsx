import {useMemo} from 'react'
import type {SeedDataset, TimelineWidget} from '@/types/widget'
import {formatStatValue} from '@/lib/charts/formatStatValue'
import WidgetEmptyState from './WidgetEmptyState'

type TimelineWidgetProps = {
  widget: TimelineWidget
  dataset: SeedDataset
}

export default function TimelineWidget({dataset}: TimelineWidgetProps) {
  const rows = useMemo(
    () =>
      [...dataset.portfolioTimeseries]
        .slice(-5)
        .reverse()
        .map((row) => ({
          date: new Date(row.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}),
          value: formatStatValue(row.portfolioValue, 'currency'),
          flow: formatStatValue(row.netFlows, 'currency'),
        })),
    [dataset.portfolioTimeseries],
  )

  if (rows.length === 0) {
    return <WidgetEmptyState message="No timeline data available." />
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={`${row.date}-${row.value}`} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className="size-2 rounded-full bg-indigo-400" />
            <span className="mt-1 h-full w-px bg-zinc-800" />
          </div>
          <div className="min-w-0 flex-1 rounded-md border border-zinc-800 bg-zinc-950/50 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-zinc-200">{row.date}</span>
              <span className="font-mono text-xs text-zinc-500">{row.flow} flow</span>
            </div>
            <p className="mt-1 text-sm text-zinc-400">Portfolio closed at {row.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
