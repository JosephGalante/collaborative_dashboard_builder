import type { AssetClass } from '@/types/widget'
import { useDashboardStore } from '@/stores/dashboardStore'

const assetClassOptions: { value: AssetClass; label: string }[] = [
  { value: 'equities', label: 'Equities' },
  { value: 'fixed_income', label: 'Fixed income' },
  { value: 'cash', label: 'Cash' },
  { value: 'alternatives', label: 'Alternatives' },
]

const inputClass =
  'mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
const labelClass = 'block text-xs font-medium text-zinc-400'

export default function GlobalFiltersPanel() {
  const globalFilters = useDashboardStore((state) => state.globalFilters)
  const setGlobalFilters = useDashboardStore((state) => state.setGlobalFilters)

  const { dateRange, assetClasses } = globalFilters

  function toggleAssetClass(value: AssetClass) {
    const next = assetClasses.includes(value)
      ? assetClasses.filter((a) => a !== value)
      : [...assetClasses, value]
    setGlobalFilters({ assetClasses: next })
  }

  return (
    <div className="mt-4 space-y-5">
      <p className="text-xs text-zinc-500">
        Filters apply to all widgets. Empty asset selection means include all classes.
      </p>

      <fieldset className="space-y-3 rounded-md border border-zinc-800 p-3">
        <legend className="px-1 text-xs font-medium text-zinc-500">Date range</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="filter-date-from" className={labelClass}>
              From
            </label>
            <input
              id="filter-date-from"
              type="date"
              value={dateRange.from ?? ''}
              onChange={(event) =>
                setGlobalFilters({
                  dateRange: {
                    ...dateRange,
                    from: event.target.value || null,
                  },
                })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="filter-date-to" className={labelClass}>
              To
            </label>
            <input
              id="filter-date-to"
              type="date"
              value={dateRange.to ?? ''}
              onChange={(event) =>
                setGlobalFilters({
                  dateRange: {
                    ...dateRange,
                    to: event.target.value || null,
                  },
                })
              }
              className={inputClass}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setGlobalFilters({ dateRange: { from: null, to: null } })}
          className="text-xs text-indigo-400 hover:text-indigo-300"
        >
          Clear dates
        </button>
      </fieldset>

      <fieldset className="space-y-2 rounded-md border border-zinc-800 p-3">
        <legend className="px-1 text-xs font-medium text-zinc-500">Asset classes</legend>
        <div className="flex flex-col gap-2">
          {assetClassOptions.map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={assetClasses.includes(opt.value)}
                onChange={() => toggleAssetClass(opt.value)}
                className="rounded border-zinc-600 bg-zinc-900 text-indigo-500 focus:ring-indigo-500/40"
              />
              {opt.label}
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setGlobalFilters({ assetClasses: [] })}
          className="text-xs text-indigo-400 hover:text-indigo-300"
        >
          Clear asset filters
        </button>
      </fieldset>
    </div>
  )
}
