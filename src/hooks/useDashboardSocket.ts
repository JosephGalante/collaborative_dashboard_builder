import { useEffect, useMemo, useRef } from 'react'
import type { ClientToServerEvent, PresenceUser, ServerToClientEvent } from '@/types/presence'
import { usePresenceStore } from '@/stores/presenceStore'
import { useDashboardStore } from '@/stores/dashboardStore'

/**
 * One presence identity per browser tab. `localStorage` would dedupe tabs into the same userId,
 * so the "others online" count would stay at 0 when testing in two tabs.
 */
const TAB_USER_KEY = 'cdb-presence-tab-user'

const palette = ['#818cf8', '#22d3ee', '#34d399', '#f472b6', '#f59e0b', '#fb7185']

function randomLabel() {
  return `Analyst ${Math.floor(Math.random() * 900 + 100)}`
}

function createUser(): PresenceUser {
  return {
    userId: crypto.randomUUID(),
    name: randomLabel(),
    color: palette[Math.floor(Math.random() * palette.length)] ?? '#818cf8',
  }
}

function getOrCreateUser(): PresenceUser {
  const raw = window.sessionStorage.getItem(TAB_USER_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as PresenceUser
      if (parsed.userId && parsed.name && parsed.color) {
        return parsed
      }
    } catch {
      // ignore broken session storage payloads
    }
  }
  const user = createUser()
  window.sessionStorage.setItem(TAB_USER_KEY, JSON.stringify(user))
  return user
}

function toWsUrl(): string {
  const explicitBase = import.meta.env.VITE_WS_BASE_URL as string | undefined
  if (explicitBase) {
    return `${explicitBase.replace(/\/$/, '')}/ws`
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}/ws`
}

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
}

export function useDashboardSocket(dashboardId: string | undefined) {
  const selectedWidgetId = useDashboardStore((s) => s.selectedWidgetId)

  const setConnectionStatus = usePresenceStore((s) => s.setConnectionStatus)
  const setCurrentUser = usePresenceStore((s) => s.setCurrentUser)
  const setSnapshot = usePresenceStore((s) => s.setSnapshot)
  const upsertUser = usePresenceStore((s) => s.upsertUser)
  const removeUser = usePresenceStore((s) => s.removeUser)
  const updateCursor = usePresenceStore((s) => s.updateCursor)
  const removeCursor = usePresenceStore((s) => s.removeCursor)
  const updateSelection = usePresenceStore((s) => s.updateSelection)
  const resetPresence = usePresenceStore((s) => s.resetPresence)
  const currentUser = usePresenceStore((s) => s.currentUser)

  const socketRef = useRef<WebSocket | null>(null)
  const valid = useMemo(() => Boolean(dashboardId && isUuid(dashboardId)), [dashboardId])

  useEffect(() => {
    if (!valid || !dashboardId) {
      resetPresence()
      return
    }

    const user = getOrCreateUser()
    setCurrentUser(user)
    setConnectionStatus('connecting')

    const ws = new WebSocket(toWsUrl())
    socketRef.current = ws

    const send = (event: ClientToServerEvent) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(event))
      }
    }

    ws.addEventListener('open', () => {
      setConnectionStatus('connected')
      send({
        type: 'presence:join',
        payload: { dashboardId, user },
      })
    })

    ws.addEventListener('message', (message) => {
      try {
        const event = JSON.parse(String(message.data)) as ServerToClientEvent
        if (event.type === 'presence:snapshot') {
          setSnapshot(event.payload)
          return
        }
        if (event.type === 'presence:identity_assigned') {
          window.sessionStorage.setItem(TAB_USER_KEY, JSON.stringify(event.payload.user))
          setCurrentUser(event.payload.user)
          return
        }
        if (event.type === 'presence:user_joined') {
          upsertUser(event.payload)
          return
        }
        if (event.type === 'presence:user_left') {
          removeUser(event.payload.userId)
          return
        }
        if (event.type === 'cursor:moved') {
          updateCursor(event.payload)
          return
        }
        if (event.type === 'selection:updated') {
          updateSelection(event.payload)
        }
      } catch {
        // ignore malformed events
      }
    })

    ws.addEventListener('close', () => {
      setConnectionStatus('disconnected')
    })

    ws.addEventListener('error', () => {
      setConnectionStatus('disconnected')
    })

    return () => {
      send({
        type: 'presence:leave',
        payload: { dashboardId, userId: user.userId },
      })
      ws.close()
      if (socketRef.current === ws) {
        socketRef.current = null
      }
      resetPresence()
    }
  }, [dashboardId, valid, resetPresence, setConnectionStatus, setCurrentUser, setSnapshot, upsertUser, removeUser, updateCursor, updateSelection])

  useEffect(() => {
    if (!dashboardId || !currentUser) {
      return
    }
    const ws = socketRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return
    }

    ws.send(
      JSON.stringify({
        type: 'selection:update',
        payload: {
          dashboardId,
          userId: currentUser.userId,
          selectedWidgetId,
        },
      } satisfies ClientToServerEvent),
    )
  }, [dashboardId, currentUser, selectedWidgetId])

  useEffect(() => {
    if (!dashboardId || !currentUser) {
      return
    }
    let rafId = 0
    let lastSentAt = 0

    const emit = (x: number, y: number) => {
      const ws = socketRef.current
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return
      }
      ws.send(
        JSON.stringify({
          type: 'cursor:move',
          payload: { dashboardId, userId: currentUser.userId, x, y },
        } satisfies ClientToServerEvent),
      )
    }

    const onPointerMove = (event: PointerEvent) => {
      const canvas = document.querySelector<HTMLElement>('[data-dashboard-canvas="true"]')
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return

      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      if (x < 0 || x > 1 || y < 0 || y > 1) return

      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const now = Date.now()
        if (now - lastSentAt < 32) return
        lastSentAt = now
        emit(x, y)
      })
    }

    window.addEventListener('pointermove', onPointerMove)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onPointerMove)
      removeCursor(currentUser.userId)
    }
  }, [dashboardId, currentUser, removeCursor])
}
