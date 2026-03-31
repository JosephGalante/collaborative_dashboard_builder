import { create } from 'zustand'
import type { Dashboard } from '../types/dashboard'
import type {
  GlobalFilters,
  Widget,
  WidgetId,
  WidgetLayout,
  WidgetType,
} from '../types/widget'

const defaultGlobalFilters: GlobalFilters = {
  dateRange: {
    from: null,
    to: null,
  },
  assetClasses: [],
}

type DashboardStore = {
  dashboardId: string | null
  name: string
  widgets: Widget[]
  layouts: WidgetLayout[]
  globalFilters: GlobalFilters
  selectedWidgetId: WidgetId | null
  isHydrated: boolean
  isDirty: boolean
  lastSavedAt: string | null
  hydrateFromDashboard: (dashboard: Dashboard) => void
  setDashboardName: (name: string) => void
  addWidget: (widgetType: WidgetType) => void
  updateWidget: (widgetId: WidgetId, updater: (widget: Widget) => Widget) => void
  removeWidget: (widgetId: WidgetId) => void
  duplicateWidget: (widgetId: WidgetId) => void
  setLayouts: (layouts: WidgetLayout[]) => void
  updateLayoutItem: (widgetId: WidgetId, patch: Partial<WidgetLayout>) => void
  setGlobalFilters: (filters: Partial<GlobalFilters>) => void
  selectWidget: (widgetId: WidgetId | null) => void
  markSaved: (savedAt: string) => void
  markDirty: () => void
  resetDirty: () => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboardId: null,
  name: 'Untitled Dashboard',
  widgets: [],
  layouts: [],
  globalFilters: defaultGlobalFilters,
  selectedWidgetId: null,
  isHydrated: false,
  isDirty: false,
  lastSavedAt: null,

  hydrateFromDashboard: (dashboard) =>
    set({
      dashboardId: dashboard.id,
      name: dashboard.name,
      widgets: dashboard.widgets,
      layouts: dashboard.layouts,
      globalFilters: dashboard.globalFilters,
      selectedWidgetId: null,
      isHydrated: true,
      isDirty: false,
      lastSavedAt: dashboard.updatedAt,
    }),

  setDashboardName: (name) => set({ name, isDirty: true }),

  addWidget: (_widgetType) => {
    // Implemented in Milestone 2.
    set({ isDirty: true })
  },

  updateWidget: (widgetId, updater) =>
    set((state) => ({
      widgets: state.widgets.map((widget) =>
        widget.id === widgetId ? updater(widget) : widget,
      ),
      isDirty: true,
    })),

  removeWidget: (widgetId) =>
    set((state) => ({
      widgets: state.widgets.filter((widget) => widget.id !== widgetId),
      layouts: state.layouts.filter((layout) => layout.i !== widgetId),
      selectedWidgetId:
        state.selectedWidgetId === widgetId ? null : state.selectedWidgetId,
      isDirty: true,
    })),

  duplicateWidget: (_widgetId) => {
    // Implemented in Milestone 2.
    set({ isDirty: true })
  },

  setLayouts: (layouts) => set({ layouts, isDirty: true }),

  updateLayoutItem: (widgetId, patch) =>
    set((state) => ({
      layouts: state.layouts.map((layout) =>
        layout.i === widgetId ? { ...layout, ...patch } : layout,
      ),
      isDirty: true,
    })),

  setGlobalFilters: (filters) =>
    set((state) => ({
      globalFilters: {
        ...state.globalFilters,
        ...filters,
      },
      isDirty: true,
    })),

  selectWidget: (widgetId) => set({ selectedWidgetId: widgetId }),

  markSaved: (savedAt) => set({ lastSavedAt: savedAt, isDirty: false }),

  markDirty: () => set({ isDirty: true }),

  resetDirty: () => set({ isDirty: false }),
}))

export function getDashboardDraft() {
  const state = getDashboardStore()
  return {
    id: state.dashboardId,
    name: state.name,
    widgets: state.widgets,
    layouts: state.layouts,
    globalFilters: state.globalFilters,
  }
}

function getDashboardStore() {
  return useDashboardStore.getState()
}
