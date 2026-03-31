import { create } from 'zustand'
import type { Dashboard } from '@/types/dashboard'
import type {
  GlobalFilters,
  Widget,
  WidgetId,
  WidgetLayout,
  WidgetType,
} from '@/types/widget'

const defaultGlobalFilters: GlobalFilters = {
  dateRange: {
    from: null,
    to: null,
  },
  assetClasses: [],
}

function createDefaultWidget(type: WidgetType): Widget {
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

function createDefaultLayout(itemId: WidgetId, index: number): WidgetLayout {
  const columns = 12
  const itemWidth = 4
  const itemHeight = 4
  const itemsPerRow = columns / itemWidth

  return {
    i: itemId,
    w: itemWidth,
    h: itemHeight,
    x: (index % itemsPerRow) * itemWidth,
    y: Math.floor(index / itemsPerRow) * itemHeight,
    minW: 3,
    minH: 3,
  }
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

  addWidget: (widgetType) =>
    set((state) => {
      const nextWidget = createDefaultWidget(widgetType)
      const nextLayout = createDefaultLayout(nextWidget.id, state.layouts.length)

      return {
        widgets: [...state.widgets, nextWidget],
        layouts: [...state.layouts, nextLayout],
        selectedWidgetId: nextWidget.id,
        isDirty: true,
      }
    }),

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

  duplicateWidget: (widgetId) =>
    set((state) => {
      const sourceWidget = state.widgets.find((widget) => widget.id === widgetId)
      if (!sourceWidget) {
        return {}
      }

      const sourceLayout = state.layouts.find((layout) => layout.i === widgetId)
      const clonedWidget = { ...sourceWidget, id: crypto.randomUUID(), title: `${sourceWidget.title} Copy` }
      const clonedLayout: WidgetLayout = sourceLayout
        ? { ...sourceLayout, i: clonedWidget.id, x: sourceLayout.x + 1, y: sourceLayout.y + 1 }
        : createDefaultLayout(clonedWidget.id, state.layouts.length)

      return {
        widgets: [...state.widgets, clonedWidget],
        layouts: [...state.layouts, clonedLayout],
        selectedWidgetId: clonedWidget.id,
        isDirty: true,
      }
    }),

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
