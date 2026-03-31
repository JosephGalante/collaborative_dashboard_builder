import {create} from 'zustand'
import type {Dashboard} from '@/types/dashboard'
import type {GlobalFilters, Widget, WidgetId, WidgetLayout, WidgetType} from '@/types/widget'
import {createDefaultLayout, createDefaultWidget} from '@/lib/widgets/defaultWidget'

const defaultGlobalFilters: GlobalFilters = {
  dateRange: {
    from: null,
    to: null,
  },
  assetClasses: [],
}

const HISTORY_LIMIT = 100

type DashboardDocumentState = {
  name: string
  widgets: Widget[]
  layouts: WidgetLayout[]
  globalFilters: GlobalFilters
  selectedWidgetId: WidgetId | null
}

function cloneDocumentState(state: DashboardDocumentState): DashboardDocumentState {
  return {
    name: state.name,
    widgets: structuredClone(state.widgets),
    layouts: structuredClone(state.layouts),
    globalFilters: structuredClone(state.globalFilters),
    selectedWidgetId: state.selectedWidgetId,
  }
}

function getDocumentState(
  state: Pick<
    DashboardStore,
    'name' | 'widgets' | 'layouts' | 'globalFilters' | 'selectedWidgetId'
  >,
): DashboardDocumentState {
  return cloneDocumentState({
    name: state.name,
    widgets: state.widgets,
    layouts: state.layouts,
    globalFilters: state.globalFilters,
    selectedWidgetId: state.selectedWidgetId,
  })
}

function withHistory(
  state: DashboardStore,
  nextDocument: DashboardDocumentState,
): Partial<DashboardStore> {
  return {
    ...nextDocument,
    historyPast: [...state.historyPast.slice(-(HISTORY_LIMIT - 1)), getDocumentState(state)],
    historyFuture: [],
    isDirty: true,
    isSaving: false,
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
  /** Milestone 6: set true while autosave mutation is in flight */
  isSaving: boolean
  historyPast: DashboardDocumentState[]
  historyFuture: DashboardDocumentState[]
  setSaving: (saving: boolean) => void
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
  undo: () => void
  redo: () => void
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
  isSaving: false,
  historyPast: [],
  historyFuture: [],

  setSaving: (saving) => set({isSaving: saving}),

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
      isSaving: false,
      historyPast: [],
      historyFuture: [],
      lastSavedAt: dashboard.updatedAt,
    }),

  setDashboardName: (name) =>
    set((state) =>
      withHistory(state, {
        ...getDocumentState(state),
        name,
      }),
    ),

  addWidget: (widgetType) =>
    set((state) => {
      const nextWidget = createDefaultWidget(widgetType)
      const nextLayout = createDefaultLayout(nextWidget.id, state.layouts.length, widgetType)

      return withHistory(state, {
        ...getDocumentState(state),
        widgets: [...state.widgets, nextWidget],
        layouts: [...state.layouts, nextLayout],
        selectedWidgetId: nextWidget.id,
      })
    }),

  updateWidget: (widgetId, updater) =>
    set((state) =>
      withHistory(state, {
        ...getDocumentState(state),
        widgets: state.widgets.map((widget) => (widget.id === widgetId ? updater(widget) : widget)),
      }),
    ),

  removeWidget: (widgetId) =>
    set((state) =>
      withHistory(state, {
        ...getDocumentState(state),
        widgets: state.widgets.filter((widget) => widget.id !== widgetId),
        layouts: state.layouts.filter((layout) => layout.i !== widgetId),
        selectedWidgetId: state.selectedWidgetId === widgetId ? null : state.selectedWidgetId,
      }),
    ),

  duplicateWidget: (widgetId) =>
    set((state) => {
      const sourceWidget = state.widgets.find((widget) => widget.id === widgetId)
      if (!sourceWidget) {
        return {}
      }

      const sourceLayout = state.layouts.find((layout) => layout.i === widgetId)
      const clonedWidget = {
        ...sourceWidget,
        id: crypto.randomUUID(),
        title: `${sourceWidget.title} Copy`,
      }
      const clonedLayout: WidgetLayout = sourceLayout
        ? {...sourceLayout, i: clonedWidget.id, x: sourceLayout.x + 1, y: sourceLayout.y + 1}
        : createDefaultLayout(clonedWidget.id, state.layouts.length, clonedWidget.type)

      return withHistory(state, {
        ...getDocumentState(state),
        widgets: [...state.widgets, clonedWidget],
        layouts: [...state.layouts, clonedLayout],
        selectedWidgetId: clonedWidget.id,
      })
    }),

  setLayouts: (layouts) =>
    set((state) =>
      withHistory(state, {
        ...getDocumentState(state),
        layouts,
      }),
    ),

  updateLayoutItem: (widgetId, patch) =>
    set((state) =>
      withHistory(state, {
        ...getDocumentState(state),
        layouts: state.layouts.map((layout) =>
          layout.i === widgetId ? {...layout, ...patch} : layout,
        ),
      }),
    ),

  setGlobalFilters: (filters) =>
    set((state) =>
      withHistory(state, {
        ...getDocumentState(state),
        globalFilters: {
          ...state.globalFilters,
          ...filters,
          dateRange:
            filters.dateRange !== undefined
              ? {...state.globalFilters.dateRange, ...filters.dateRange}
              : state.globalFilters.dateRange,
          assetClasses:
            filters.assetClasses !== undefined
              ? filters.assetClasses
              : state.globalFilters.assetClasses,
        },
      }),
    ),

  selectWidget: (widgetId) => set({selectedWidgetId: widgetId}),

  markSaved: (savedAt) => set({lastSavedAt: savedAt, isDirty: false, isSaving: false}),

  markDirty: () => set({isDirty: true}),

  resetDirty: () => set({isDirty: false}),

  undo: () =>
    set((state) => {
      const previous = state.historyPast.at(-1)
      if (!previous) {
        return {}
      }

      return {
        ...cloneDocumentState(previous),
        historyPast: state.historyPast.slice(0, -1),
        historyFuture: [getDocumentState(state), ...state.historyFuture].slice(0, HISTORY_LIMIT),
        isDirty: true,
        isSaving: false,
      }
    }),

  redo: () =>
    set((state) => {
      const next = state.historyFuture[0]
      if (!next) {
        return {}
      }

      return {
        ...cloneDocumentState(next),
        historyPast: [...state.historyPast, getDocumentState(state)].slice(-HISTORY_LIMIT),
        historyFuture: state.historyFuture.slice(1),
        isDirty: true,
        isSaving: false,
      }
    }),
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
