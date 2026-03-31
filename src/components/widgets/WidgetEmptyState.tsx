type WidgetEmptyStateProps = {
  message?: string
}

export default function WidgetEmptyState({
  message = 'No data to display for the current filters.',
}: WidgetEmptyStateProps) {
  return (
    <div className="flex h-full min-h-[100px] items-center justify-center rounded-md border border-dashed border-zinc-700 bg-zinc-950/50 px-3 text-center text-xs text-zinc-500">
      {message}
    </div>
  )
}
