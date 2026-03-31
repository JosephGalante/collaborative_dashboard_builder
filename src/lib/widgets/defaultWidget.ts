import type {Widget, WidgetId, WidgetLayout, WidgetType} from '@/types/widget'

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

  if (type === 'area') {
    return {
      id,
      type: 'area',
      title: 'Portfolio Area Trend',
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

  if (type === 'donut') {
    return {
      id,
      type: 'donut',
      title: 'Allocation Breakdown',
      config: {
        datasetKey: 'assetAllocation',
        categoryField: 'assetClass',
        valueField: 'marketValue',
      },
    }
  }

  if (type === 'summary') {
    return {
      id,
      type: 'summary',
      title: 'Performance Summary',
      config: {
        datasetKey: 'performanceStats',
      },
    }
  }

  if (type === 'allocationList') {
    return {
      id,
      type: 'allocationList',
      title: 'Allocation List',
      config: {
        datasetKey: 'assetAllocation',
      },
    }
  }

  if (type === 'timeline') {
    return {
      id,
      type: 'timeline',
      title: 'Recent Activity',
      config: {
        datasetKey: 'portfolioTimeseries',
      },
    }
  }

  if (type === 'insight') {
    return {
      id,
      type: 'insight',
      title: 'Analyst Insight',
      config: {
        datasetKey: 'performanceStats',
      },
    }
  }

  if (type === 'metricPair') {
    return {
      id,
      type: 'metricPair',
      title: 'Metric Pair',
      config: {
        datasetKey: 'performanceStats',
      },
    }
  }

  if (type === 'allocationSpotlight') {
    return {
      id,
      type: 'allocationSpotlight',
      title: 'Allocation Spotlight',
      config: {
        datasetKey: 'assetAllocation',
      },
    }
  }

  if (type === 'healthBanner') {
    return {
      id,
      type: 'healthBanner',
      title: 'Health Banner',
      config: {
        datasetKey: 'performanceStats',
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

export function createDefaultLayout(
  itemId: WidgetId,
  index: number,
  type?: WidgetType,
): WidgetLayout {
  const columns = 12
  const itemWidth = 4
  const itemHeight = type === 'timeline' ? 10 : 7
  const minHeight = type === 'timeline' ? 8 : 5
  const itemsPerRow = columns / itemWidth

  return {
    i: itemId,
    w: itemWidth,
    h: itemHeight,
    x: (index % itemsPerRow) * itemWidth,
    y: Math.floor(index / itemsPerRow) * itemHeight,
    minW: 3,
    minH: minHeight,
  }
}
