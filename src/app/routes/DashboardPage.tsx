import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import DashboardLoadingSkeleton from '@/components/dashboard/DashboardLoadingSkeleton'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { getDashboard } from '@/api/dashboards'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useDashboardAutosave } from '@/hooks/useDashboardAutosave'

const uuidSchema = z.string().uuid()

export default function DashboardPage() {
  const { dashboardId } = useParams()
  const hydrateFromDashboard = useDashboardStore((s) => s.hydrateFromDashboard)
  const hydratedFor = useRef<string | null>(null)

  const validId = Boolean(dashboardId && uuidSchema.safeParse(dashboardId).success)

  const query = useQuery({
    queryKey: ['dashboard', dashboardId],
    queryFn: () => getDashboard(dashboardId!),
    enabled: validId,
    staleTime: Infinity,
    retry: 1,
  })

  useEffect(() => {
    if (dashboardId !== hydratedFor.current) {
      hydratedFor.current = null
    }
  }, [dashboardId])

  useEffect(() => {
    const data = query.data?.dashboard
    if (!data || !dashboardId) {
      return
    }
    if (hydratedFor.current === dashboardId) {
      return
    }
    hydrateFromDashboard(data)
    hydratedFor.current = dashboardId
  }, [query.data, dashboardId, hydrateFromDashboard])

  useDashboardAutosave(dashboardId)

  if (!dashboardId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        Missing dashboard id.
      </div>
    )
  }

  if (!validId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-center text-zinc-300">
        <p className="text-sm text-zinc-400">Invalid dashboard id.</p>
        <Link
          to="/dashboards/new"
          className="rounded-md border border-zinc-600 px-4 py-2 text-sm hover:border-zinc-400"
        >
          Create a dashboard
        </Link>
      </div>
    )
  }

  if (query.isLoading) {
    return <DashboardLoadingSkeleton />
  }

  if (query.isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-center text-zinc-300">
        <p className="max-w-md text-sm text-zinc-400">
          {query.error instanceof Error ? query.error.message : 'Failed to load dashboard.'}
        </p>
        <Link
          to="/dashboards/new"
          className="rounded-md border border-zinc-600 px-4 py-2 text-sm hover:border-zinc-400"
        >
          Create a dashboard
        </Link>
      </div>
    )
  }

  return <DashboardShell />
}
