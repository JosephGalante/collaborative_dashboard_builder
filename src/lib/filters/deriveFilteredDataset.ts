import type { AssetClass, GlobalFilters, PerformanceStatBlock, SeedDataset } from '@/types/widget'

function rowInDateRange(dateStr: string, range: GlobalFilters['dateRange']): boolean {
  if (range.from && dateStr < range.from) {
    return false
  }
  if (range.to && dateStr > range.to) {
    return false
  }
  return true
}

function derivePerformanceStats(
  seed: SeedDataset,
  filteredTimeseries: SeedDataset['portfolioTimeseries'],
): PerformanceStatBlock {
  const base = seed.performanceStats

  if (filteredTimeseries.length === 0) {
    return {
      totalValue: 0,
      dailyChange: 0,
      ytdReturnPct: base.ytdReturnPct,
    }
  }

  const sorted = [...filteredTimeseries].sort((a, b) => a.date.localeCompare(b.date))
  const last = sorted[sorted.length - 1]
  const totalValue = last.portfolioValue

  let dailyChange = base.dailyChange
  if (sorted.length >= 2) {
    const prev = sorted[sorted.length - 2]
    dailyChange = last.portfolioValue - prev.portfolioValue
  }

  return {
    totalValue,
    dailyChange,
    ytdReturnPct: base.ytdReturnPct,
  }
}

/**
 * Client-side only: apply global filters to the seeded dataset.
 * Date range filters the portfolio time series; asset classes filter allocation rows (and influence stat derivation).
 */
export function deriveFilteredDataset(seed: SeedDataset, filters: GlobalFilters): SeedDataset {
  const portfolioTimeseries = seed.portfolioTimeseries.filter((row) =>
    rowInDateRange(row.date, filters.dateRange),
  )

  const assetAllocation =
    filters.assetClasses.length === 0
      ? seed.assetAllocation
      : seed.assetAllocation.filter((row) =>
          filters.assetClasses.includes(row.assetClass as AssetClass),
        )

  const performanceStats = derivePerformanceStats(seed, portfolioTimeseries)

  return {
    portfolioTimeseries,
    assetAllocation,
    performanceStats,
  }
}
