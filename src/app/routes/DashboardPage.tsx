import {useCallback, useEffect, useRef, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {useQuery} from '@tanstack/react-query'
import {z} from 'zod'
import DashboardLoadingSkeleton from '@/components/dashboard/DashboardLoadingSkeleton'
import DashboardShell from '@/components/dashboard/DashboardShell'
import {getDashboard} from '@/api/dashboards'
import {useDashboardStore} from '@/stores/dashboardStore'
import {useDashboardAutosave} from '@/hooks/useDashboardAutosave'
import {useDashboardSocket} from '@/hooks/useDashboardSocket'

const uuidSchema = z.uuid()

export default function DashboardPage() {
  const {dashboardId} = useParams()
  const hydrateFromDashboard = useDashboardStore((s) => s.hydrateFromDashboard)
  const isDirty = useDashboardStore((s) => s.isDirty)
  const hydratedFor = useRef<string | null>(null)
  const [remoteUpdateState, setRemoteUpdateState] = useState<{
    dashboardId: string | null
    pending: boolean
    updatedAt: string | null
  }>({
    dashboardId: null,
    pending: false,
    updatedAt: null,
  })

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

  const reloadRemoteDashboard = useCallback(async () => {
    const result = await query.refetch()
    if (result.data?.dashboard) {
      hydratedFor.current = null
      hydrateFromDashboard(result.data.dashboard)
      hydratedFor.current = dashboardId ?? null
      setRemoteUpdateState({
        dashboardId: dashboardId ?? null,
        pending: false,
        updatedAt: null,
      })
    }
  }, [query, hydrateFromDashboard, dashboardId])

  const handleRemoteDashboardUpdated = useCallback(
    ({dashboardId: updatedDashboardId, updatedAt}: {dashboardId: string; updatedAt: string}) => {
      if (updatedDashboardId !== dashboardId) {
        return
      }
      if (isDirty) {
        setRemoteUpdateState({
          dashboardId: updatedDashboardId,
          pending: true,
          updatedAt,
        })
        return
      }
      void reloadRemoteDashboard()
    },
    [dashboardId, isDirty, reloadRemoteDashboard],
  )

  useDashboardAutosave(dashboardId)
  useDashboardSocket(dashboardId, {onRemoteDashboardUpdated: handleRemoteDashboardUpdated})

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

  return (
    <DashboardShell
      remoteUpdatePending={
        remoteUpdateState.pending && remoteUpdateState.dashboardId === dashboardId
      }
      remoteUpdateUpdatedAt={
        remoteUpdateState.dashboardId === dashboardId ? remoteUpdateState.updatedAt : null
      }
      onReloadRemoteUpdate={() => void reloadRemoteDashboard()}
      onDismissRemoteUpdate={() =>
        setRemoteUpdateState((current) => ({
          ...current,
          pending: false,
        }))
      }
    />
  )
}
