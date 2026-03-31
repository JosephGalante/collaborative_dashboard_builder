import { useEffect } from 'react'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'
import { updateDashboard } from '@/api/dashboards'
import { getDashboardDraft, useDashboardStore } from '@/stores/dashboardStore'

/**
 * Debounced autosave when the store is dirty. Requires a hydrated dashboard id.
 */
export function useDashboardAutosave(dashboardId: string | undefined) {
  const isHydrated = useDashboardStore((s) => s.isHydrated)
  const isDirty = useDashboardStore((s) => s.isDirty)
  const setSaving = useDashboardStore((s) => s.setSaving)
  const markSaved = useDashboardStore((s) => s.markSaved)
  const snapshot = useDashboardStore(
    useShallow((s) => ({
      name: s.name,
      widgets: s.widgets,
      layouts: s.layouts,
      globalFilters: s.globalFilters,
    })),
  )

  useEffect(() => {
    if (!dashboardId || !isHydrated) {
      return
    }
    if (!z.string().uuid().safeParse(dashboardId).success) {
      return
    }
    if (!isDirty) {
      return
    }

    const handle = window.setTimeout(async () => {
      const draft = getDashboardDraft()
      if (!draft.id || draft.id !== dashboardId) {
        return
      }
      setSaving(true)
      try {
        const res = await updateDashboard(draft.id, {
          name: draft.name,
          widgets: draft.widgets,
          layouts: draft.layouts,
          globalFilters: draft.globalFilters,
        })
        markSaved(res.dashboard.updatedAt)
      } catch {
        setSaving(false)
      }
    }, 850)

    return () => window.clearTimeout(handle)
  }, [dashboardId, isHydrated, isDirty, snapshot, setSaving, markSaved])
}
