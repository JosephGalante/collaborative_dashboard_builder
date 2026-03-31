import GridLayout, {WidthProvider} from 'react-grid-layout/legacy'
import {useMemo, useRef, useState} from 'react'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import WidgetCard from './WidgetCard'
import RemoteCursorLayer from '@/components/presence/RemoteCursorLayer'
import {useDashboardStore} from '@/stores/dashboardStore'
import {useDerivedSeedDataset} from '@/hooks/useDerivedSeedDataset'
import {usePresenceStore} from '@/stores/presenceStore'

const AutoWidthGridLayout = WidthProvider(GridLayout)

type LayoutItem = {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}

function normalizeLayouts(
  nextLayouts: ReadonlyArray<LayoutItem>,
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

function maybeSwapHorizontalNeighbor(
  previousLayouts: LayoutItem[],
  nextLayouts: LayoutItem[],
  oldItem: LayoutItem,
  newItem: LayoutItem,
) {
  const deltaX = newItem.x - oldItem.x
  const deltaY = newItem.y - oldItem.y
  const horizontalMove = deltaX !== 0 && Math.abs(deltaX) >= Math.abs(deltaY)
  if (!horizontalMove) {
    return nextLayouts
  }

  const direction = deltaX > 0 ? 1 : -1
  const rowItems = previousLayouts
    .filter((layout) => layout.y === oldItem.y && layout.h === oldItem.h && layout.w === oldItem.w)
    .sort((a, b) => a.x - b.x)

  const oldIndex = rowItems.findIndex((layout) => layout.i === oldItem.i)
  if (oldIndex === -1) {
    return nextLayouts
  }

  const sameRowNeighbors = rowItems.filter((layout) => {
    if (layout.i === oldItem.i) {
      return false
    }
    return direction === 1 ? layout.x > oldItem.x : layout.x < oldItem.x
  })

  const targetNeighbor = sameRowNeighbors.sort((a, b) =>
    direction === 1 ? a.x - b.x : b.x - a.x,
  )[0]

  if (!targetNeighbor) {
    return nextLayouts
  }

  const draggedCenter = newItem.x + newItem.w / 2
  const neighborCenter = targetNeighbor.x + targetNeighbor.w / 2
  const crossedNeighbor =
    direction === 1 ? draggedCenter >= neighborCenter : draggedCenter <= neighborCenter

  if (!crossedNeighbor) {
    return nextLayouts
  }

  const targetIndex = rowItems.findIndex((layout) => layout.i === targetNeighbor.i)
  if (targetIndex === -1) {
    return nextLayouts
  }

  const reorderedRow = [...rowItems]
  const [movedItem] = reorderedRow.splice(oldIndex, 1)
  if (!movedItem) {
    return nextLayouts
  }
  reorderedRow.splice(targetIndex, 0, movedItem)

  const nextRowLayouts = new Map(
    reorderedRow.map((layout, index) => [layout.i, {...layout, x: rowItems[index]?.x ?? layout.x}]),
  )

  return previousLayouts.map((layout) => nextRowLayouts.get(layout.i) ?? {...layout})
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
  const dragStartLayoutsRef = useRef<LayoutItem[]>([])
  const [dragPreviewLayouts, setDragPreviewLayouts] = useState<LayoutItem[] | null>(null)
  const activeLayouts = dragPreviewLayouts ?? layouts

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
          compactType="vertical"
          resizeHandles={['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']}
          draggableHandle=".drag-handle"
          draggableCancel=".widget-action"
          layout={activeLayouts}
          onDragStart={() => {
            dragStartLayoutsRef.current = normalizeLayouts(layouts)
            setDragPreviewLayouts(normalizeLayouts(layouts))
          }}
          onDrag={(nextLayouts, oldItem, newItem) => {
            if (!oldItem || !newItem) {
              setDragPreviewLayouts(normalizeLayouts(nextLayouts))
              return
            }
            setDragPreviewLayouts(
              maybeSwapHorizontalNeighbor(
                dragStartLayoutsRef.current,
                normalizeLayouts(nextLayouts),
                oldItem,
                newItem,
              ),
            )
          }}
          onDragStop={(nextLayouts, oldItem, newItem) => {
            if (!oldItem || !newItem) {
              setDragPreviewLayouts(null)
              setLayouts(normalizeLayouts(nextLayouts))
              return
            }
            const adjustedLayouts = maybeSwapHorizontalNeighbor(
              dragStartLayoutsRef.current,
              normalizeLayouts(nextLayouts),
              oldItem,
              newItem,
            )
            setDragPreviewLayouts(null)
            setLayouts(normalizeLayouts(adjustedLayouts))
          }}
          onResizeStop={(nextLayouts) => {
            setDragPreviewLayouts(null)
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
