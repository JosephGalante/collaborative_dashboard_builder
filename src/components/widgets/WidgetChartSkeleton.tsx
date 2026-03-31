export default function WidgetChartSkeleton() {
  return (
    <div className="flex h-full min-h-[120px] flex-col justify-end gap-2 rounded-md border border-zinc-800 bg-zinc-950/80 p-3">
      <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-700" />
      <div className="mt-auto flex flex-1 items-end gap-1">
        {[40, 65, 45, 80, 55].map((h, i) => (
          <div
            key={i}
            className="flex-1 animate-pulse rounded-sm bg-zinc-700"
            style={{height: `${h}%`, maxHeight: '100%'}}
          />
        ))}
      </div>
    </div>
  )
}
