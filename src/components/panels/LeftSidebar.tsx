import { Link } from 'react-router-dom'
import { useDashboardStore } from '@/stores/dashboardStore'

const widgetButtons = [
  { label: 'Line chart', desc: 'Time series', type: 'line' },
  { label: 'Bar chart', desc: 'Allocation', type: 'bar' },
  { label: 'Stat card', desc: 'KPI', type: 'stat' },
] as const

export default function LeftSidebar() {
  const addWidget = useDashboardStore((state) => state.addWidget)

  return (
    <aside className="flex min-h-0 flex-col border-r border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Widget library
            </h2>
            <p className="mt-1 text-xs text-zinc-500">Add tiles to the canvas.</p>
          </div>
          <Link
            to="/dashboards/new"
            className="shrink-0 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-[11px] font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
            title="Create a new dashboard"
          >
            New
          </Link>
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {widgetButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            onClick={() => addWidget(button.type)}
            className="w-full rounded-lg border border-zinc-700/90 bg-zinc-950/80 px-3 py-2.5 text-left transition hover:border-zinc-500 hover:bg-zinc-900 active:scale-[0.99]"
          >
            <span className="block text-sm font-medium text-zinc-100">{button.label}</span>
            <span className="mt-0.5 block text-xs text-zinc-500">{button.desc}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
