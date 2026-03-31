import {useMemo} from 'react'
import type {InsightWidget, SeedDataset} from '@/types/widget'
import {formatAssetClassLabel, formatStatValue} from '@/lib/charts/formatStatValue'
import WidgetEmptyState from './WidgetEmptyState'

type InsightWidgetProps = {
  widget: InsightWidget
  dataset: SeedDataset
}

export default function InsightWidget({dataset}: InsightWidgetProps) {
  const insights = useMemo(() => {
    const topAllocation = [...dataset.assetAllocation].sort(
      (a, b) => b.marketValue - a.marketValue,
    )[0]
    if (!topAllocation) {
      return []
    }

    const ytd = dataset.performanceStats.ytdReturnPct
    const daily = dataset.performanceStats.dailyChange

    return [
      {
        label: 'Top allocation',
        value: formatAssetClassLabel(topAllocation.assetClass),
        tone: 'text-indigo-300',
      },
      {
        label: 'Daily move',
        value: `${daily >= 0 ? '+' : ''}${formatStatValue(daily, 'currency')}`,
        tone: daily >= 0 ? 'text-emerald-300' : 'text-rose-300',
      },
      {
        label: 'YTD posture',
        value:
          ytd >= 0
            ? `Ahead ${formatStatValue(ytd, 'percent')}`
            : `Behind ${formatStatValue(ytd, 'percent')}`,
        tone: ytd >= 0 ? 'text-cyan-300' : 'text-amber-300',
      },
    ]
  }, [dataset.assetAllocation, dataset.performanceStats])

  if (insights.length === 0) {
    return <WidgetEmptyState message="No insight data available." />
  }

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <div
          key={insight.label}
          className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-3"
        >
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">{insight.label}</p>
          <p className={`mt-1 text-sm font-medium ${insight.tone}`}>{insight.value}</p>
        </div>
      ))}
    </div>
  )
}
