import type { Widget, WidgetId, WidgetType } from '@/types/widget'
import { reassignWidgetType } from '@/lib/widgets/defaultWidget'
import { widgetDisplayName } from '@/components/widgets/widgetRegistry'

const inputClass =
  'mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none ring-indigo-500/0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
const labelClass = 'block text-xs font-medium text-zinc-400'

type WidgetConfigFormProps = {
  widget: Widget
  updateWidget: (widgetId: WidgetId, updater: (widget: Widget) => Widget) => void
}

const widgetTypes: WidgetType[] = ['line', 'bar', 'stat']

export default function WidgetConfigForm({ widget, updateWidget }: WidgetConfigFormProps) {
  return (
    <div className="mt-4 space-y-5">
      <div>
        <label htmlFor={`widget-title-${widget.id}`} className={labelClass}>
          Title
        </label>
        <input
          id={`widget-title-${widget.id}`}
          type="text"
          maxLength={80}
          value={widget.title}
          onChange={(event) =>
            updateWidget(widget.id, (current) => ({
              ...current,
              title: event.target.value,
            }))
          }
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={`widget-type-${widget.id}`} className={labelClass}>
          Widget type
        </label>
        <select
          id={`widget-type-${widget.id}`}
          value={widget.type}
          onChange={(event) => {
            const nextType = event.target.value as WidgetType
            updateWidget(widget.id, (current) => reassignWidgetType(current, nextType))
          }}
          className={inputClass}
        >
          {widgetTypes.map((type) => (
            <option key={type} value={type}>
              {widgetDisplayName(type)}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-zinc-500">
          Changing type resets chart options to that type&apos;s defaults.
        </p>
      </div>

      {widget.type === 'line' ? <LineConfigFields widget={widget} updateWidget={updateWidget} /> : null}
      {widget.type === 'bar' ? <BarConfigFields /> : null}
      {widget.type === 'stat' ? <StatConfigFields widget={widget} updateWidget={updateWidget} /> : null}
    </div>
  )
}

function LineConfigFields({
  widget,
  updateWidget,
}: {
  widget: Extract<Widget, { type: 'line' }>
  updateWidget: WidgetConfigFormProps['updateWidget']
}) {
  return (
    <fieldset className="space-y-3 rounded-md border border-zinc-800 p-3">
      <legend className="px-1 text-xs font-medium text-zinc-500">Line chart</legend>
      <div>
        <span className={labelClass}>Dataset</span>
        <p className="mt-1 rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-1.5 text-sm text-zinc-300">
          Portfolio time series
        </p>
      </div>
      <div>
        <span className={labelClass}>X axis</span>
        <p className="mt-1 rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-1.5 text-sm text-zinc-300">
          Date (ISO)
        </p>
      </div>
      <div>
        <label htmlFor={`line-y-${widget.id}`} className={labelClass}>
          Y axis
        </label>
        <select
          id={`line-y-${widget.id}`}
          value={widget.config.yField}
          onChange={(event) => {
            const yField = event.target.value as 'portfolioValue' | 'netFlows'
            updateWidget(widget.id, (current) => {
              if (current.type !== 'line') return current
              return {
                ...current,
                config: { ...current.config, yField },
              }
            })
          }}
          className={inputClass}
        >
          <option value="portfolioValue">Portfolio value</option>
          <option value="netFlows">Net flows</option>
        </select>
      </div>
    </fieldset>
  )
}

function BarConfigFields() {
  return (
    <fieldset className="space-y-3 rounded-md border border-zinc-800 p-3">
      <legend className="px-1 text-xs font-medium text-zinc-500">Bar chart</legend>
      <p className="text-xs text-zinc-500">
        This widget uses the asset allocation dataset with category <code className="text-zinc-400">assetClass</code>{' '}
        and value <code className="text-zinc-400">marketValue</code>. Those fields are fixed for this MVP.
      </p>
    </fieldset>
  )
}

function StatConfigFields({
  widget,
  updateWidget,
}: {
  widget: Extract<Widget, { type: 'stat' }>
  updateWidget: WidgetConfigFormProps['updateWidget']
}) {
  return (
    <fieldset className="space-y-3 rounded-md border border-zinc-800 p-3">
      <legend className="px-1 text-xs font-medium text-zinc-500">Stat card</legend>
      <div>
        <label htmlFor={`stat-key-${widget.id}`} className={labelClass}>
          Metric
        </label>
        <select
          id={`stat-key-${widget.id}`}
          value={widget.config.statKey}
          onChange={(event) => {
            const statKey = event.target.value as 'totalValue' | 'dailyChange' | 'ytdReturnPct'
            updateWidget(widget.id, (current) => {
              if (current.type !== 'stat') return current
              return {
                ...current,
                config: { ...current.config, statKey },
              }
            })
          }}
          className={inputClass}
        >
          <option value="totalValue">Total value</option>
          <option value="dailyChange">Daily change</option>
          <option value="ytdReturnPct">YTD return</option>
        </select>
      </div>
      <div>
        <label htmlFor={`stat-format-${widget.id}`} className={labelClass}>
          Format
        </label>
        <select
          id={`stat-format-${widget.id}`}
          value={widget.config.format}
          onChange={(event) => {
            const format = event.target.value as 'currency' | 'percent' | 'number'
            updateWidget(widget.id, (current) => {
              if (current.type !== 'stat') return current
              return {
                ...current,
                config: { ...current.config, format },
              }
            })
          }}
          className={inputClass}
        >
          <option value="currency">Currency</option>
          <option value="percent">Percent</option>
          <option value="number">Number</option>
        </select>
      </div>
    </fieldset>
  )
}
