import { useEffect } from 'react'
import DashboardCanvas from './DashboardCanvas'
import DashboardSaveStatus from './DashboardSaveStatus'
import LeftSidebar from '@/components/panels/LeftSidebar'
import RightConfigPanel from '@/components/panels/RightConfigPanel'
import { useDashboardStore } from '@/stores/dashboardStore'

export default function DashboardShell() {
  const isDirty = useDashboardStore((state) => state.isDirty)
  const lastSavedAt = useDashboardStore((state) => state.lastSavedAt)
  const isSaving = useDashboardStore((state) => state.isSaving)
  const selectedWidgetId = useDashboardStore((state) => state.selectedWidgetId)
  const selectWidget = useDashboardStore((state) => state.selectWidget)

  useEffect(() => {
    if (!selectedWidgetId) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        selectWidget(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedWidgetId, selectWidget])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="flex h-14 items-center justify-between border-b border-zinc-800 px-4">
        <div className="font-medium">Collaborative Dashboard Builder</div>
        <DashboardSaveStatus isDirty={isDirty} lastSavedAt={lastSavedAt} isSaving={isSaving} />
      </header>

      <main className="grid h-[calc(100vh-56px)] grid-cols-[240px_1fr_320px]">
        <LeftSidebar />
        <DashboardCanvas />
        <RightConfigPanel />
      </main>
    </div>
  )
}
