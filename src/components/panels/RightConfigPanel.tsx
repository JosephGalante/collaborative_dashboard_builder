import { useMemo } from 'react'
import { useDashboardStore } from '@/stores/dashboardStore'

export default function RightConfigPanel() {
  const widgets = useDashboardStore((state) => state.widgets)
  const selectedWidgetId = useDashboardStore((state) => state.selectedWidgetId)

  const selectedWidget = useMemo(
    () => widgets.find((widget) => widget.id === selectedWidgetId) ?? null,
    [selectedWidgetId, widgets],
  )

  return (
    <aside className="border-l border-zinc-800 bg-zinc-900/50 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Widget Settings
      </h2>
      {selectedWidget ? (
        <div className="mt-4 rounded-md border border-indigo-500/40 bg-zinc-900 p-3 text-sm">
          <p className="text-zinc-400">Selected widget</p>
          <p className="mt-1 font-medium text-zinc-100">{selectedWidget.title}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
            {selectedWidget.type}
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-md border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-400">
          Select a widget to edit its title and configuration.
        </div>
      )}
    </aside>
  )
}
