import { useMemo } from 'react'
import { usePresenceStore } from '@/stores/presenceStore'

function statusDot(status: 'disconnected' | 'connecting' | 'connected') {
  if (status === 'connected') return 'bg-emerald-500'
  if (status === 'connecting') return 'bg-amber-400 animate-pulse'
  return 'bg-zinc-600'
}

export default function PresenceStatus() {
  const users = usePresenceStore((s) => s.users)
  const connectionStatus = usePresenceStore((s) => s.connectionStatus)
  const currentUser = usePresenceStore((s) => s.currentUser)

  const remoteUsers = useMemo(
    () => users.filter((u) => u.userId !== currentUser?.userId),
    [users, currentUser],
  )

  const statusLabel =
    connectionStatus === 'connecting'
      ? 'Connecting…'
      : connectionStatus === 'disconnected'
        ? 'Offline'
        : remoteUsers.length === 0
          ? 'No one else online'
          : `${remoteUsers.length} other${remoteUsers.length === 1 ? '' : 's'} online`

  return (
    <div
      className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-2 py-1.5"
      title="Each browser tab counts as a separate viewer. Edits are not synced live between tabs yet."
    >
      <span className={`inline-block size-2 rounded-full ${statusDot(connectionStatus)}`} />
      <span className="text-xs text-zinc-400">{statusLabel}</span>
      <div className="ml-1 flex -space-x-1.5">
        {remoteUsers.slice(0, 3).map((user) => (
          <span
            key={user.userId}
            title={user.name}
            className="inline-flex size-5 items-center justify-center rounded-full border border-zinc-900 text-[10px] font-semibold text-zinc-950"
            style={{ backgroundColor: user.color }}
          >
            {user.name.slice(0, 1).toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  )
}
