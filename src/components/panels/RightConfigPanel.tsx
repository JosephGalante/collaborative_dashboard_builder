import { useMemo } from 'react'
import { useDashboardStore } from '@/stores/dashboardStore'
import WidgetConfigForm from '@/components/panels/WidgetConfigForm'

export default function RightConfigPanel() {
  const widgets = useDashboardStore((state) => state.widgets)
  const selectedWidgetId = useDashboardStore((state) => state.selectedWidgetId)
  const updateWidget = useDashboardStore((state) => state.updateWidget)

  const selectedWidget = useMemo(
    () => widgets.find((widget) => widget.id === selectedWidgetId) ?? null,
    [selectedWidgetId, widgets],
  )

  return (
    <aside className="flex min-h-0 flex-col border-l border-zinc-800 bg-zinc-900/50 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Widget Settings
      </h2>
      {selectedWidget ? (
        <div className="mt-2 min-h-0 flex-1 overflow-y-auto rounded-md border border-indigo-500/30 bg-zinc-900/80 p-3">
          <p className="text-xs text-zinc-500">Editing widget · changes mark the dashboard as unsaved.</p>
          <WidgetConfigForm widget={selectedWidget} updateWidget={updateWidget} />
        </div>
      ) : (
        <div className="mt-4 rounded-md border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-400">
          Select a widget on the canvas to edit its title, type, and options. Global filters will appear here when
          nothing is selected in a later milestone.
        </div>
      )}
    </aside>
  )
}
