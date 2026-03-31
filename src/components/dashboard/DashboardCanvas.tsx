import GridLayout, {WidthProvider} from 'react-grid-layout/legacy'
import {useMemo} from 'react'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import WidgetCard from './WidgetCard'
import RemoteCursorLayer from '@/components/presence/RemoteCursorLayer'
import {useDashboardStore} from '@/stores/dashboardStore'
import {useDerivedSeedDataset} from '@/hooks/useDerivedSeedDataset'
import {usePresenceStore} from '@/stores/presenceStore'

const AutoWidthGridLayout = WidthProvider(GridLayout)

function normalizeLayouts(
  nextLayouts: ReadonlyArray<{
    i: string
    x: number
    y: number
    w: number
    h: number
    minW?: number
    minH?: number
  }>,
) {
  return nextLayouts.map((layout) => ({
    i: layout.i,
    x: layout.x,
    y: layout.y,
    w: layout.w,
    h: layout.h,
    minW: layout.minW,
    minH: layout.minH,
  }))
}

export default function DashboardCanvas() {
  const widgets = useDashboardStore((state) => state.widgets)
  const layouts = useDashboardStore((state) => state.layouts)
  const globalFilters = useDashboardStore((state) => state.globalFilters)
  const selectedWidgetId = useDashboardStore((state) => state.selectedWidgetId)
  const setLayouts = useDashboardStore((state) => state.setLayouts)
  const selectWidget = useDashboardStore((state) => state.selectWidget)
  const removeWidget = useDashboardStore((state) => state.removeWidget)
  const duplicateWidget = useDashboardStore((state) => state.duplicateWidget)
  const users = usePresenceStore((state) => state.users)
  const selections = usePresenceStore((state) => state.selections)
  const currentUser = usePresenceStore((state) => state.currentUser)
  const dataset = useDerivedSeedDataset(globalFilters)

  const remoteEditorsByWidgetId = useMemo(() => {
    const byWidgetId = new Map<string, Array<{userId: string; name: string; color: string}>>()
    for (const user of users) {
      if (user.userId === currentUser?.userId) continue
      const selected = selections[user.userId]
      if (!selected) continue
      const next = byWidgetId.get(selected) ?? []
      next.push({userId: user.userId, name: user.name, color: user.color})
      byWidgetId.set(selected, next)
    }
    return byWidgetId
  }, [users, selections, currentUser])

  if (widgets.length === 0) {
    return (
      <section className="border-x border-zinc-800 p-4">
        <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl border border-dashed border-zinc-700/90 bg-zinc-900/40 px-6 py-12">
          <div className="max-w-sm text-center">
            <p className="text-base font-semibold tracking-tight text-zinc-100">
              Start with a widget
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Use the library on the left to add a line chart, bar chart, or stat card. Drag the
              handle on each tile to move it; resize from the corner.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="border-x border-zinc-800 p-4">
      <div
        data-dashboard-canvas="true"
        onMouseDown={(event) => {
          const target = event.target as HTMLElement
          if (
            target.closest('[data-widget-card="true"]') ||
            target.closest('.drag-handle') ||
            target.closest('.widget-action') ||
            target.closest('.react-resizable-handle')
          ) {
            return
          }
          selectWidget(null)
        }}
        className="relative h-full overflow-auto rounded-xl border border-zinc-800/90 bg-zinc-900/50 p-2 shadow-inner"
      >
        <RemoteCursorLayer />
        <AutoWidthGridLayout
          className="layout"
          cols={12}
          rowHeight={32}
          margin={[12, 12]}
          compactType={null}
          resizeHandles={['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']}
          draggableHandle=".drag-handle"
          draggableCancel=".widget-action"
          layout={layouts}
          onDragStop={(nextLayouts) => {
            setLayouts(normalizeLayouts(nextLayouts))
          }}
          onResizeStop={(nextLayouts) => {
            setLayouts(normalizeLayouts(nextLayouts))
          }}
        >
          {widgets.map((widget) => (
            <div key={widget.id} className="h-full">
              <WidgetCard
                widget={widget}
                dataset={dataset}
                isSelected={selectedWidgetId === widget.id}
                remoteEditors={remoteEditorsByWidgetId.get(widget.id) ?? []}
                onSelect={selectWidget}
                onRemove={removeWidget}
                onDuplicate={duplicateWidget}
              />
            </div>
          ))}
        </AutoWidthGridLayout>
      </div>
    </section>
  )
}
