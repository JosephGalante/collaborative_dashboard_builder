import { useMemo } from 'react'
import { useDashboardStore } from '@/stores/dashboardStore'
import WidgetConfigForm from '@/components/panels/WidgetConfigForm'
import GlobalFiltersPanel from '@/components/panels/GlobalFiltersPanel'
import { usePresenceStore } from '@/stores/presenceStore'

type RightConfigPanelProps = {
  collapsed: boolean
  onToggle: () => void
}

export default function RightConfigPanel({ collapsed, onToggle }: RightConfigPanelProps) {
  const widgets = useDashboardStore((state) => state.widgets)
  const selectedWidgetId = useDashboardStore((state) => state.selectedWidgetId)
  const updateWidget = useDashboardStore((state) => state.updateWidget)
  const duplicateWidget = useDashboardStore((state) => state.duplicateWidget)
  const removeWidget = useDashboardStore((state) => state.removeWidget)
  const selectWidget = useDashboardStore((state) => state.selectWidget)
  const users = usePresenceStore((state) => state.users)
  const selections = usePresenceStore((state) => state.selections)
  const currentUser = usePresenceStore((state) => state.currentUser)

  const selectedWidget = useMemo(
    () => widgets.find((widget) => widget.id === selectedWidgetId) ?? null,
    [selectedWidgetId, widgets],
  )
  const remoteEditors = useMemo(() => {
    if (!selectedWidget) {
      return []
    }
    return users.filter(
      (user) =>
        user.userId !== currentUser?.userId && selections[user.userId] === selectedWidget.id,
    )
  }, [selectedWidget, users, currentUser, selections])

  return (
    <aside className="flex min-h-0 flex-col border-l border-zinc-800 bg-zinc-900/50">
      <div
        className={['border-b border-zinc-800', collapsed ? 'px-2 py-2' : 'px-4 py-3'].join(' ')}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {!collapsed ? (
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {selectedWidget ? 'Widget' : 'Workspace'}
              </h2>
            ) : null}
            {!collapsed ? (
              <p className="mt-1 truncate text-sm font-medium text-zinc-200">
                {selectedWidget ? selectedWidget.title : 'Global filters'}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="shrink-0 rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-[11px] font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
            title={collapsed ? 'Expand right panel' : 'Collapse right panel'}
          >
            {collapsed ? '«' : '»'}
          </button>
        </div>
      </div>

      {collapsed ? <div className="flex-1" /> : null}

      {!collapsed ? (
        selectedWidget ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-zinc-800 px-4 py-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => duplicateWidget(selectedWidget.id)}
                  className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-500 hover:text-zinc-50"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removeWidget(selectedWidget.id)
                    selectWidget(null)
                  }}
                  className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-rose-500/50 hover:text-rose-200"
                >
                  Remove
                </button>
              </div>
              <p className="mt-2 text-[11px] leading-snug text-zinc-500">
                Changes save automatically after you pause editing. Press Delete or Backspace to
                remove the selected widget when focus is not in a field.
              </p>
              {remoteEditors.length > 0 ? (
                <div className="mt-2 rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-[11px] text-amber-200/95">
                  {remoteEditors.length === 1
                    ? `${remoteEditors[0]?.name} is editing this widget right now.`
                    : `${remoteEditors.length} collaborators are editing this widget right now.`}{' '}
                  Updates are last-write-wins.
                </div>
              ) : null}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              <WidgetConfigForm widget={selectedWidget} updateWidget={updateWidget} />
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            <p className="text-xs leading-relaxed text-zinc-500">
              Select a widget on the canvas to edit its settings, or adjust filters below. Press{' '}
              <kbd className="rounded border border-zinc-600 bg-zinc-950 px-1 py-0.5 font-mono text-[10px] text-zinc-400">
                Esc
              </kbd>{' '}
              to clear selection.
            </p>
            <GlobalFiltersPanel />
          </div>
        )
      ) : null}
    </aside>
  )
}
