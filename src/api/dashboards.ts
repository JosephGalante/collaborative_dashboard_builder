import type { Dashboard } from '@/types/dashboard'
import type { GlobalFilters, Widget, WidgetLayout } from '@/types/widget'

const apiBase =
  typeof import.meta.env.VITE_API_BASE_URL === 'string'
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
    : ''

function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${apiBase}${p}`
}

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

export async function createDashboard(
  input: CreateDashboardRequest = {},
): Promise<CreateDashboardResponse> {
  const res = await fetch(apiUrl('/api/dashboards'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Failed to create dashboard (${res.status})`)
  }
  return res.json() as Promise<CreateDashboardResponse>
}

export async function getDashboard(id: string): Promise<GetDashboardResponse> {
  const res = await fetch(apiUrl(`/api/dashboards/${encodeURIComponent(id)}`))
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Failed to load dashboard (${res.status})`)
  }
  return res.json() as Promise<GetDashboardResponse>
}

export async function updateDashboard(
  id: string,
  input: UpdateDashboardRequest,
): Promise<UpdateDashboardResponse> {
  const res = await fetch(apiUrl(`/api/dashboards/${encodeURIComponent(id)}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Failed to save dashboard (${res.status})`)
  }
  return res.json() as Promise<UpdateDashboardResponse>
}
