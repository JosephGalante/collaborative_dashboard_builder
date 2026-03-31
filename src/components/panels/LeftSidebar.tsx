import {Link} from 'react-router-dom'
import {useDashboardStore} from '@/stores/dashboardStore'

const widgetButtons = [
  {label: 'Line chart', desc: 'Time series', type: 'line'},
  {label: 'Area chart', desc: 'Filled trend', type: 'area'},
  {label: 'Bar chart', desc: 'Allocation', type: 'bar'},
  {label: 'Donut chart', desc: 'Breakdown', type: 'donut'},
  {label: 'Stat card', desc: 'Single KPI', type: 'stat'},
  {label: 'Summary widget', desc: 'Multi-metric', type: 'summary'},
  {label: 'Allocation list', desc: 'Ranked weights', type: 'allocationList'},
  {label: 'Timeline feed', desc: 'Recent snapshots', type: 'timeline'},
  {label: 'Insight card', desc: 'Computed takeaways', type: 'insight'},
  {label: 'Metric pair', desc: 'Two key stats', type: 'metricPair'},
  {label: 'Allocation spotlight', desc: 'Largest position', type: 'allocationSpotlight'},
  {label: 'Health banner', desc: 'Status summary', type: 'healthBanner'},
] as const

type LeftSidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export default function LeftSidebar({collapsed, onToggle}: LeftSidebarProps) {
  const addWidget = useDashboardStore((state) => state.addWidget)

  return (
    <aside className="flex min-h-0 flex-col border-r border-zinc-800 bg-zinc-900/50">
      <div
        className={['border-b border-zinc-800', collapsed ? 'px-2 py-2' : 'px-4 py-3'].join(' ')}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            {!collapsed ? (
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Widget library
              </h2>
            ) : null}
            {!collapsed ? (
              <p className="mt-1 text-xs text-zinc-500">Add tiles to the canvas.</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="shrink-0 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-[11px] font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
            title={collapsed ? 'Expand widget library' : 'Collapse widget library'}
          >
            {collapsed ? '»' : '«'}
          </button>
        </div>
      </div>
      <div
        className={['flex-1 space-y-2 overflow-y-auto', collapsed ? 'px-2 py-2' : 'px-4 py-3'].join(
          ' ',
        )}
      >
        <Link
          to="/dashboards/new"
          className={[
            'block rounded-md border border-zinc-700 bg-zinc-950 text-center text-[11px] font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100',
            collapsed ? 'px-2 py-2' : 'px-2 py-1',
          ].join(' ')}
          title="Create a new dashboard"
        >
          {collapsed ? '+' : 'New dashboard'}
        </Link>
        {widgetButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            onClick={() => addWidget(button.type)}
            className={[
              'w-full rounded-lg border border-zinc-700/90 bg-zinc-950/80 transition hover:border-zinc-500 hover:bg-zinc-900 active:scale-[0.99]',
              collapsed ? 'px-0 py-2.5 text-center' : 'px-3 py-2.5 text-left',
            ].join(' ')}
            title={button.label}
          >
            <span className="block text-sm font-medium text-zinc-100">
              {collapsed ? button.label[0] : button.label}
            </span>
            {!collapsed ? (
              <span className="mt-0.5 block text-xs text-zinc-500">{button.desc}</span>
            ) : null}
          </button>
        ))}
      </div>
    </aside>
  )
}
