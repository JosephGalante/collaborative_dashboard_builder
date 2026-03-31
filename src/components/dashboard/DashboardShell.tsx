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
  const canUndo = useDashboardStore((state) => state.historyPast.length > 0)
  const canRedo = useDashboardStore((state) => state.historyFuture.length > 0)
  const selectWidget = useDashboardStore((state) => state.selectWidget)
  const removeWidget = useDashboardStore((state) => state.removeWidget)
  const undo = useDashboardStore((state) => state.undo)
  const redo = useDashboardStore((state) => state.redo)
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
      const isModifierPressed = event.metaKey || event.ctrlKey
      if (isModifierPressed && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) {
          redo()
        } else {
          undo()
        }
        return
      }
      if (isModifierPressed && event.key.toLowerCase() === 'y') {
        event.preventDefault()
        redo()
        return
      }
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedWidgetId) {
        event.preventDefault()
        removeWidget(selectedWidgetId)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedWidgetId, selectWidget, removeWidget, undo, redo])

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
          <div className="flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/60 p-1">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className={[
                'inline-flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium transition',
                canUndo
                  ? 'cursor-pointer text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                  : 'cursor-not-allowed text-zinc-600',
              ].join(' ')}
              title="Undo (Cmd/Ctrl+Z)"
            >
              <span aria-hidden>↶</span>
              Undo
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className={[
                'inline-flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium transition',
                canRedo
                  ? 'cursor-pointer text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                  : 'cursor-not-allowed text-zinc-600',
              ].join(' ')}
              title="Redo (Cmd/Ctrl+Shift+Z)"
            >
              <span aria-hidden>↷</span>
              Redo
            </button>
          </div>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-3.5 fill-current"
            >
              <path d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.66.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.09 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.35 9.35 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.96-2.34 4.83-4.57 5.08.36.32.69.95.69 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z" />
            </svg>
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
