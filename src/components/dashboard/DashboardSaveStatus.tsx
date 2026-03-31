import {useMemo} from 'react'

type DashboardSaveStatusProps = {
  isDirty: boolean
  lastSavedAt: string | null
  /** Set true when Milestone 6 autosave mutation is in flight */
  isSaving?: boolean
}

function formatSavedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export default function DashboardSaveStatus({
  isDirty,
  lastSavedAt,
  isSaving = false,
}: DashboardSaveStatusProps) {
  const label = useMemo(() => {
    if (isSaving) {
      return {text: 'Saving…', className: 'text-amber-300'}
    }
    if (isDirty) {
      return {text: 'Unsaved changes', className: 'text-amber-400'}
    }
    if (lastSavedAt) {
      return {
        text: `Saved · ${formatSavedAt(lastSavedAt)}`,
        className: 'text-emerald-400/90',
      }
    }
    return {
      text: 'All changes saved',
      className: 'text-zinc-500',
    }
  }, [isDirty, isSaving, lastSavedAt])

  return (
    <div
      className="flex items-start gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm tabular-nums"
      role="status"
      aria-live="polite"
      aria-label={label.text}
    >
      <span
        className={[
          'mt-1.5 inline-block size-2 shrink-0 rounded-full',
          isSaving
            ? 'animate-pulse bg-amber-400'
            : isDirty
              ? 'bg-amber-400'
              : lastSavedAt
                ? 'bg-emerald-500'
                : 'bg-zinc-600',
        ].join(' ')}
        aria-hidden
      />
      <div className="min-w-0">
        <span className={label.className}>{label.text}</span>
        <span className="mt-0.5 block text-[11px] font-normal text-zinc-500">
          Autosaves when you pause editing
        </span>
      </div>
    </div>
  )
}
