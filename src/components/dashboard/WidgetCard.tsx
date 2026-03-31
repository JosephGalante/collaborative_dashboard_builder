import type { Widget } from '@/types/widget'

type WidgetCardProps = {
  widget: Widget
  isSelected: boolean
  onSelect: (widgetId: string) => void
  onRemove: (widgetId: string) => void
}

const widgetTypeLabel: Record<Widget['type'], string> = {
  line: 'Line Chart',
  bar: 'Bar Chart',
  stat: 'Stat Card',
}

export default function WidgetCard({
  widget,
  isSelected,
  onSelect,
  onRemove,
}: WidgetCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(widget.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(widget.id)
        }
      }}
      className={[
        'h-full rounded-lg border bg-zinc-900 p-3 text-left transition',
        isSelected ? 'border-indigo-400 shadow-[0_0_0_1px_rgba(129,140,248,0.45)]' : 'border-zinc-700 hover:border-zinc-500',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {widgetTypeLabel[widget.type]}
          </p>
          <h3 className="mt-1 text-sm font-medium text-zinc-100">{widget.title}</h3>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onRemove(widget.id)
          }}
          className="widget-action rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:border-zinc-500"
        >
          Remove
        </button>
      </div>

      <div className="mt-3 flex h-[calc(100%-56px)] items-center justify-center rounded border border-dashed border-zinc-700 text-xs text-zinc-500">
        Widget content placeholder
      </div>
    </article>
  )
}
