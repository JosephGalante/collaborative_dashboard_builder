import type {MetricPairWidget, SeedDataset} from '@/types/widget'
import {formatStatValue} from '@/lib/charts/formatStatValue'

type MetricPairWidgetProps = {
  widget: MetricPairWidget
  dataset: SeedDataset
}

export default function MetricPairWidget({dataset}: MetricPairWidgetProps) {
  return (
    <div className="grid h-full grid-cols-2 gap-3">
      <div className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-3">
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">Total Value</p>
        <p className="mt-2 font-mono text-lg font-semibold text-zinc-100">
          {formatStatValue(dataset.performanceStats.totalValue, 'currency')}
        </p>
      </div>
      <div className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-3">
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">YTD Return</p>
        <p className="mt-2 font-mono text-lg font-semibold text-cyan-300">
          {formatStatValue(dataset.performanceStats.ytdReturnPct, 'percent')}
        </p>
      </div>
    </div>
  )
}
