import type {WidgetType} from '@/types/widget'

export const widgetRegistry: Record<WidgetType, {displayName: string}> = {
  line: {displayName: 'Line Chart'},
  bar: {displayName: 'Bar Chart'},
  stat: {displayName: 'Stat Card'},
}

export function widgetDisplayName(type: WidgetType): string {
  return widgetRegistry[type].displayName
}
