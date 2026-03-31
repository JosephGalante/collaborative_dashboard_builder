import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { createDashboard } from '@/api/dashboards'

export default function CreateDashboardPage() {
  const navigate = useNavigate()
  const started = useRef(false)

  const { mutate, isError } = useMutation({
    mutationFn: () => createDashboard({}),
    onSuccess: (res) => {
      navigate(`/dashboards/${res.dashboard.id}`, { replace: true })
    },
  })

  useEffect(() => {
    if (started.current) {
      return
    }
    started.current = true
    mutate()
  }, [mutate])

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 px-6 text-zinc-200">
        <p className="max-w-md text-center text-sm text-zinc-400">
          Could not create a dashboard. Start Postgres and the API (`npm run dev:api`), ensure{' '}
          <code className="rounded bg-zinc-700 px-1.5 py-0.5">DATABASE_URL</code> matches{' '}
          <code className="rounded bg-zinc-700 px-1.5 py-0.5">docker compose up -d</code>, then
          retry.
        </p>
        <button
          type="button"
          onClick={() => mutate()}
          className="rounded-md border border-zinc-600 px-4 py-2 text-sm hover:border-zinc-400"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
      Creating dashboard…
    </div>
  )
}
