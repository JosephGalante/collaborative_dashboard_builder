import type { Widget, WidgetId, WidgetLayout, WidgetType } from '@/types/widget'

export function createDefaultWidget(type: WidgetType): Widget {
  const id = crypto.randomUUID()

  if (type === 'line') {
    return {
      id,
      type: 'line',
      title: 'Portfolio Value',
      config: {
        datasetKey: 'portfolioTimeseries',
        xField: 'date',
        yField: 'portfolioValue',
      },
    }
  }

  if (type === 'bar') {
    return {
      id,
      type: 'bar',
      title: 'Asset Allocation',
      config: {
        datasetKey: 'assetAllocation',
        categoryField: 'assetClass',
        valueField: 'marketValue',
      },
    }
  }

  return {
    id,
    type: 'stat',
    title: 'Total Value',
    config: {
      datasetKey: 'performanceStats',
      statKey: 'totalValue',
      format: 'currency',
    },
  }
}

/**
 * Keep id and title; replace type and config with defaults for `newType`.
 */
export function reassignWidgetType(widget: Widget, newType: WidgetType): Widget {
  if (widget.type === newType) {
    return widget
  }
  const defaults = createDefaultWidget(newType)
  return {
    ...defaults,
    id: widget.id,
    title: widget.title,
  }
}

export function createDefaultLayout(itemId: WidgetId, index: number): WidgetLayout {
  const columns = 12
  const itemWidth = 4
  const itemHeight = 7
  const itemsPerRow = columns / itemWidth

  return {
    i: itemId,
    w: itemWidth,
    h: itemHeight,
    x: (index % itemsPerRow) * itemWidth,
    y: Math.floor(index / itemsPerRow) * itemHeight,
    minW: 3,
    minH: 5,
  }
}
