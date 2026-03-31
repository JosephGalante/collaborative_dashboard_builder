import {useEffect, useMemo, useState} from 'react'
import {usePresenceStore} from '@/stores/presenceStore'

const STALE_CURSOR_MS = 8_000

export default function RemoteCursorLayer() {
  const users = usePresenceStore((s) => s.users)
  const cursors = usePresenceStore((s) => s.cursors)
  const currentUser = usePresenceStore((s) => s.currentUser)
  const [nowTick, setNowTick] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNowTick(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const cursorsToRender = useMemo(() => {
    return users
      .filter((u) => u.userId !== currentUser?.userId)
      .map((u) => ({user: u, cursor: cursors[u.userId]}))
      .filter((entry) => entry.cursor && nowTick - entry.cursor.updatedAt < STALE_CURSOR_MS)
  }, [users, cursors, currentUser, nowTick])

  if (cursorsToRender.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {cursorsToRender.map(({user, cursor}) => (
        <div
          key={user.userId}
          className="absolute"
          style={{
            left: `${Math.max(0, Math.min(1, cursor.x)) * 100}%`,
            top: `${Math.max(0, Math.min(1, cursor.y)) * 100}%`,
          }}
        >
          <div className="-translate-x-1 -translate-y-1">
            <div
              className="h-3 w-3 rounded-full border border-zinc-950 shadow"
              style={{backgroundColor: user.color}}
            />
            <div
              className="mt-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-zinc-950 shadow"
              style={{backgroundColor: user.color}}
            >
              {user.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
