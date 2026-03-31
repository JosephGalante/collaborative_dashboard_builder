import type { Dashboard } from './dashboard'
import type { DashboardId, GlobalFilters, Widget, WidgetLayout } from './widget'

export type CreateDashboardRequest = {
  name?: string
}

export type CreateDashboardResponse = {
  dashboard: Dashboard
}

export type GetDashboardResponse = {
  dashboard: Dashboard
}

export type UpdateDashboardRequest = {
  name: string
  widgets: Widget[]
  layouts: WidgetLayout[]
  globalFilters: GlobalFilters
}

export type UpdateDashboardResponse = {
  dashboard: Dashboard
}

export type ListDashboardsResponse = {
  dashboards: Array<Pick<Dashboard, 'id' | 'name' | 'createdAt' | 'updatedAt'>>
}

export type DashboardApiClient = {
  createDashboard: (input: CreateDashboardRequest) => Promise<CreateDashboardResponse>
  getDashboard: (id: DashboardId) => Promise<GetDashboardResponse>
  updateDashboard: (
    id: DashboardId,
    input: UpdateDashboardRequest,
  ) => Promise<UpdateDashboardResponse>
}
