import GridLayout, { WidthProvider } from 'react-grid-layout/legacy'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import WidgetCard from './WidgetCard'
import { useDashboardStore } from '@/stores/dashboardStore'

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
  const selectedWidgetId = useDashboardStore((state) => state.selectedWidgetId)
  const setLayouts = useDashboardStore((state) => state.setLayouts)
  const selectWidget = useDashboardStore((state) => state.selectWidget)
  const removeWidget = useDashboardStore((state) => state.removeWidget)

  if (widgets.length === 0) {
    return (
      <section className="border-x border-zinc-800 p-4">
        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-zinc-700 bg-zinc-900/60">
          <div className="text-center">
            <p className="text-lg font-medium text-zinc-200">Empty Dashboard</p>
            <p className="mt-2 text-sm text-zinc-400">
              Add your first widget from the left sidebar.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="border-x border-zinc-800 p-4">
      <div className="h-full overflow-auto rounded-lg border border-zinc-800 bg-zinc-900/60 p-2">
        <AutoWidthGridLayout
          className="layout"
          cols={12}
          rowHeight={32}
          margin={[12, 12]}
          isBounded
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
              <div className="drag-handle mb-2 cursor-grab rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-400 active:cursor-grabbing">
                Drag
              </div>
              <div className="h-[calc(100%-34px)]">
                <WidgetCard
                  widget={widget}
                  isSelected={selectedWidgetId === widget.id}
                  onSelect={selectWidget}
                  onRemove={removeWidget}
                />
              </div>
            </div>
          ))}
        </AutoWidthGridLayout>
      </div>
    </section>
  )
}
