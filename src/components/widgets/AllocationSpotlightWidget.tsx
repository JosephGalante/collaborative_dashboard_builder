import {useMemo} from 'react'
import type {AllocationSpotlightWidget, SeedDataset} from '@/types/widget'
import {formatAssetClassLabel} from '@/lib/charts/formatStatValue'
import WidgetEmptyState from './WidgetEmptyState'

type AllocationSpotlightWidgetProps = {
  widget: AllocationSpotlightWidget
  dataset: SeedDataset
}

export default function AllocationSpotlightWidget({dataset}: AllocationSpotlightWidgetProps) {
  const top = useMemo(
    () => [...dataset.assetAllocation].sort((a, b) => b.marketValue - a.marketValue)[0],
    [dataset.assetAllocation],
  )

  if (!top) {
    return <WidgetEmptyState message="No allocation data available." />
  }

  const total = dataset.assetAllocation.reduce((sum, row) => sum + row.marketValue, 0)
  const share = total > 0 ? (top.marketValue / total) * 100 : 0

  return (
    <div className="rounded-lg border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-zinc-950/40 to-cyan-500/10 px-4 py-4">
      <p className="text-[11px] uppercase tracking-wide text-zinc-500">Largest Allocation</p>
      <p className="mt-2 text-xl font-semibold text-zinc-100">
        {formatAssetClassLabel(top.assetClass)}
      </p>
      <p className="mt-1 text-sm text-zinc-400">{share.toFixed(1)}% of current portfolio mix</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
          style={{width: `${Math.max(8, share)}%`}}
        />
      </div>
    </div>
  )
}
