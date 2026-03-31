import {useMemo} from 'react'
import type {AllocationListWidget, SeedDataset} from '@/types/widget'
import {formatAssetClassLabel} from '@/lib/charts/formatStatValue'
import WidgetEmptyState from './WidgetEmptyState'

type AllocationListWidgetProps = {
  widget: AllocationListWidget
  dataset: SeedDataset
}

export default function AllocationListWidget({dataset}: AllocationListWidgetProps) {
  const rows = useMemo(() => {
    const total = dataset.assetAllocation.reduce((sum, row) => sum + row.marketValue, 0)
    return dataset.assetAllocation
      .map((row) => ({
        label: formatAssetClassLabel(row.assetClass),
        value: row.marketValue,
        share: total > 0 ? (row.marketValue / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
  }, [dataset.assetAllocation])

  if (rows.length === 0) {
    return <WidgetEmptyState message="No allocation data available." />
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="truncate text-zinc-200">{row.label}</span>
            <span className="shrink-0 font-mono text-zinc-400">{row.share.toFixed(1)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
              style={{width: `${Math.max(6, row.share)}%`}}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
