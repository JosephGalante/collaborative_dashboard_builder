import type { SeedDataset, Widget } from '@/types/widget'
import WidgetBody from '@/components/widgets/WidgetBody'
import { widgetDisplayName } from '@/components/widgets/widgetRegistry'

type WidgetCardProps = {
  widget: Widget
  dataset: SeedDataset
  isSelected: boolean
  remoteEditors?: Array<{ userId: string; name: string; color: string }>
  onSelect: (widgetId: string) => void
  onRemove: (widgetId: string) => void
  onDuplicate: (widgetId: string) => void
}

export default function WidgetCard({
  widget,
  dataset,
  isSelected,
  remoteEditors = [],
  onSelect,
  onRemove,
  onDuplicate,
}: WidgetCardProps) {
  const hasRemoteEditors = remoteEditors.length > 0

  return (
    <article
      data-widget-card="true"
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
        'relative flex h-full min-h-0 flex-col rounded-lg border bg-zinc-900/90 p-3 text-left shadow-sm transition',
        isSelected
          ? 'border-indigo-400 ring-2 ring-indigo-500/35'
          : hasRemoteEditors
            ? 'border-amber-500/70 ring-1 ring-amber-500/30'
            : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50',
      ].join(' ')}
    >
      <button
        type="button"
        onMouseDown={(event) => {
          event.stopPropagation()
          onSelect(widget.id)
        }}
        onTouchStart={(event) => {
          event.stopPropagation()
          onSelect(widget.id)
        }}
        className="drag-handle widget-action absolute left-2 top-2 inline-flex cursor-grab items-center justify-center rounded border border-zinc-700/90 bg-zinc-950/80 px-1.5 py-1 text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-300 active:cursor-grabbing"
        aria-label="Drag widget"
        title="Drag widget"
      >
        <span className="grid grid-cols-2 gap-[2px]" aria-hidden>
          <span className="size-1 rounded-full bg-current" />
          <span className="size-1 rounded-full bg-current" />
          <span className="size-1 rounded-full bg-current" />
          <span className="size-1 rounded-full bg-current" />
          <span className="size-1 rounded-full bg-current" />
          <span className="size-1 rounded-full bg-current" />
        </span>
      </button>

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 pl-8">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            {widgetDisplayName(widget.type)}
          </p>
          <h3 className="mt-1 truncate text-sm font-medium text-zinc-100">{widget.title}</h3>
          {hasRemoteEditors ? (
            <p className="mt-1 text-[11px] text-amber-300/90">
              {remoteEditors.length === 1
                ? `${remoteEditors[0]?.name} is viewing`
                : `${remoteEditors.length} collaborators viewing`}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onDuplicate(widget.id)
            }}
            className="widget-action rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
          >
            Duplicate
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onRemove(widget.id)
            }}
            className="widget-action rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition hover:border-rose-500/60 hover:text-rose-200"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="mt-3 min-h-0 flex-1">
        <WidgetBody widget={widget} dataset={dataset} />
      </div>
    </article>
  )
}
