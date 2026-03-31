import { Link } from 'react-router-dom'
import { useDashboardStore } from '@/stores/dashboardStore'

const widgetButtons = [
  { label: 'Add Line Chart', type: 'line' },
  { label: 'Add Bar Chart', type: 'bar' },
  { label: 'Add Stat Card', type: 'stat' },
] as const

export default function LeftSidebar() {
  const addWidget = useDashboardStore((state) => state.addWidget)

  return (
    <aside className="border-r border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Widget Library
        </h2>
        <Link
          to="/dashboards/new"
          className="shrink-0 rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-500"
          title="Create a new dashboard"
        >
          New
        </Link>
      </div>
      <div className="mt-4 space-y-2">
        {widgetButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            onClick={() => addWidget(button.type)}
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-200 transition hover:border-zinc-500"
          >
            {button.label}
          </button>
        ))}
      </div>
    </aside>
  )
}
