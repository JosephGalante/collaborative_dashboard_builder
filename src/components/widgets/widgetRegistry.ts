import type {WidgetType} from '@/types/widget'

export const widgetRegistry: Record<WidgetType, {displayName: string}> = {
  line: {displayName: 'Line Chart'},
  area: {displayName: 'Area Chart'},
  bar: {displayName: 'Bar Chart'},
  donut: {displayName: 'Donut Chart'},
  stat: {displayName: 'Stat Card'},
  summary: {displayName: 'Summary Widget'},
  allocationList: {displayName: 'Allocation List'},
  timeline: {displayName: 'Timeline Feed'},
  insight: {displayName: 'Insight Card'},
  metricPair: {displayName: 'Metric Pair'},
  allocationSpotlight: {displayName: 'Allocation Spotlight'},
  healthBanner: {displayName: 'Health Banner'},
}

export function widgetDisplayName(type: WidgetType): string {
  return widgetRegistry[type].displayName
}
