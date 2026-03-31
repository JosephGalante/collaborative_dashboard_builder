import {useEffect, useState} from 'react'
import DashboardCanvas from './DashboardCanvas'
import DashboardRename from './DashboardRename'
import DashboardSaveStatus from './DashboardSaveStatus'
import PresenceStatus from '@/components/presence/PresenceStatus'
import LeftSidebar from '@/components/panels/LeftSidebar'
import RightConfigPanel from '@/components/panels/RightConfigPanel'
import {isEditableTarget} from '@/lib/dom/isEditableTarget'
import {useDashboardStore} from '@/stores/dashboardStore'

const githubUrl = 'https://github.com/JosephGalante/collaborative_dashboard_builder'

export default function DashboardShell() {
  const isDirty = useDashboardStore((state) => state.isDirty)
  const lastSavedAt = useDashboardStore((state) => state.lastSavedAt)
  const isSaving = useDashboardStore((state) => state.isSaving)
  const selectedWidgetId = useDashboardStore((state) => state.selectedWidgetId)
  const selectWidget = useDashboardStore((state) => state.selectWidget)
  const removeWidget = useDashboardStore((state) => state.removeWidget)
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return
      }
      if (event.key === 'Escape') {
        if (selectedWidgetId) {
          event.preventDefault()
          selectWidget(null)
        }
        return
      }
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedWidgetId) {
        event.preventDefault()
        removeWidget(selectedWidgetId)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedWidgetId, selectWidget, removeWidget])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="flex h-14 items-center justify-between gap-4 border-b border-zinc-800 px-4">
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold tracking-tight text-zinc-100">
            Collaborative Dashboard Builder
          </div>
          <DashboardRename />
        </div>
        <div className="flex items-center gap-2">
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100"
          >
            GitHub
          </a>
          <PresenceStatus />
          <DashboardSaveStatus isDirty={isDirty} lastSavedAt={lastSavedAt} isSaving={isSaving} />
        </div>
      </header>

      <main
        className="grid h-[calc(100vh-56px)] transition-[grid-template-columns] duration-200"
        style={{
          gridTemplateColumns: `${leftCollapsed ? '64px' : '240px'} 1fr ${rightCollapsed ? '64px' : '320px'}`,
        }}
      >
        <LeftSidebar collapsed={leftCollapsed} onToggle={() => setLeftCollapsed((prev) => !prev)} />
        <DashboardCanvas />
        <RightConfigPanel
          collapsed={rightCollapsed}
          onToggle={() => setRightCollapsed((prev) => !prev)}
        />
      </main>
    </div>
  )
}
