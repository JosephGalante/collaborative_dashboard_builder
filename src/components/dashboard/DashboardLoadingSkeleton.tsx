type DashboardLoadingSkeletonProps = {
  caption?: string
}

/**
 * Full-screen loading state while the dashboard document is fetched or created.
 */
export default function DashboardLoadingSkeleton({
  caption = 'Loading dashboard…',
}: DashboardLoadingSkeletonProps) {
  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="h-8 w-48 animate-pulse rounded-md bg-zinc-800" />
          <div className="h-6 w-32 animate-pulse rounded-md bg-zinc-800" />
        </div>
        <div className="h-px w-full bg-zinc-800" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-lg bg-zinc-900" />
          <div className="h-28 animate-pulse rounded-lg bg-zinc-900" />
          <div className="h-28 animate-pulse rounded-lg bg-zinc-900" />
        </div>
        <div className="h-64 animate-pulse rounded-lg bg-zinc-900/80" />
        <p className="text-center text-sm text-zinc-500">{caption}</p>
      </div>
    </div>
  )
}
