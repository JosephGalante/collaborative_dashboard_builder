import type {HealthBannerWidget, SeedDataset} from '@/types/widget'
import {formatStatValue} from '@/lib/charts/formatStatValue'

type HealthBannerWidgetProps = {
  widget: HealthBannerWidget
  dataset: SeedDataset
}

export default function HealthBannerWidget({dataset}: HealthBannerWidgetProps) {
  const daily = dataset.performanceStats.dailyChange
  const ytd = dataset.performanceStats.ytdReturnPct
  const positive = daily >= 0 && ytd >= 0

  return (
    <div
      className={[
        'rounded-lg border px-4 py-4',
        positive
          ? 'border-emerald-500/30 bg-emerald-500/10'
          : 'border-amber-500/30 bg-amber-500/10',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">Portfolio Health</p>
          <p className="mt-2 text-lg font-semibold text-zinc-100">
            {positive ? 'Momentum is constructive' : 'Mixed signal posture'}
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Daily move {daily >= 0 ? 'up' : 'down'} {formatStatValue(Math.abs(daily), 'currency')}
          </p>
        </div>
        <span
          className={[
            'rounded-full px-2.5 py-1 text-xs font-medium',
            positive ? 'bg-emerald-400/20 text-emerald-300' : 'bg-amber-400/20 text-amber-300',
          ].join(' ')}
        >
          {formatStatValue(ytd, 'percent')} YTD
        </span>
      </div>
    </div>
  )
}
