import {useEffect, useRef, useState} from 'react'
import {useDashboardStore} from '@/stores/dashboardStore'

export default function DashboardRename() {
  const name = useDashboardStore((s) => s.name)
  const isHydrated = useDashboardStore((s) => s.isHydrated)
  const setDashboardName = useDashboardStore((s) => s.setDashboardName)

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  if (!isHydrated) {
    return null
  }

  function commit() {
    const next = draft.trim() || 'Untitled Dashboard'
    setDashboardName(next)
    setDraft(next)
    setEditing(false)
  }

  function cancel() {
    setDraft(name)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        data-dashboard-rename="true"
        type="text"
        maxLength={100}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          }
          if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
            cancel()
          }
        }}
        className="mt-0.5 w-full max-w-md rounded border border-indigo-500/50 bg-zinc-950 px-2 py-1 text-xs text-zinc-100 outline-none focus:ring-2 focus:ring-indigo-500/40"
        aria-label="Dashboard name"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(name)
        setEditing(true)
      }}
      className="group mt-0.5 flex max-w-full items-center gap-2 text-left"
      title="Rename dashboard"
    >
      <span className="min-w-0 truncate text-xs text-zinc-400">{name}</span>
      <span className="shrink-0 rounded border border-zinc-700 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
        Rename
      </span>
    </button>
  )
}
