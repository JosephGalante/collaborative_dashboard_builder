import type { GlobalFilters, Widget, WidgetLayout, DashboardId } from './widget'

export type Dashboard = {
  id: DashboardId
  name: string
  widgets: Widget[]
  layouts: WidgetLayout[]
  globalFilters: GlobalFilters
  createdAt: string
  updatedAt: string
}
