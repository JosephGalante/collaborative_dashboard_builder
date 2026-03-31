import type { FastifyPluginAsync } from 'fastify'
import websocket from '@fastify/websocket'
import { randomUUID } from 'node:crypto'

type PresenceUser = {
  userId: string
  name: string
  color: string
}

type PresenceRoom = {
  users: Map<string, PresenceUser>
  selections: Map<string, string | null>
  sockets: Set<WsLike>
}

type JoinEvent = {
  type: 'presence:join'
  payload: {
    dashboardId: string
    user: PresenceUser
  }
}

type LeaveEvent = {
  type: 'presence:leave'
  payload: {
    dashboardId: string
    userId: string
  }
}

type SelectionEvent = {
  type: 'selection:update'
  payload: {
    dashboardId: string
    userId: string
    selectedWidgetId: string | null
  }
}

type SocketEvent = JoinEvent | LeaveEvent | SelectionEvent
type WsLike = {
  readyState: number
  send: (payload: string) => void
  on: (event: 'message' | 'close', cb: ((payload: Buffer) => void) | (() => void)) => void
}

const rooms = new Map<string, PresenceRoom>()
const socketMeta = new WeakMap<WsLike, { dashboardId: string; userId: string }>()

function getRoom(dashboardId: string): PresenceRoom {
  const existing = rooms.get(dashboardId)
  if (existing) return existing
  const room: PresenceRoom = {
    users: new Map(),
    selections: new Map(),
    sockets: new Set(),
  }
  rooms.set(dashboardId, room)
  return room
}

function sendJson(socket: WsLike, event: unknown) {
  if (socket.readyState === 1) {
    socket.send(JSON.stringify(event))
  }
}

function broadcast(room: PresenceRoom, event: unknown) {
  for (const socket of room.sockets) {
    sendJson(socket, event)
  }
}

function cleanupEmptyRoom(dashboardId: string) {
  const room = rooms.get(dashboardId)
  if (!room) return
  if (room.sockets.size === 0) {
    rooms.delete(dashboardId)
  }
}

function leaveRoom(socket: WsLike) {
  const meta = socketMeta.get(socket)
  if (!meta) return
  const room = rooms.get(meta.dashboardId)
  if (!room) return

  room.sockets.delete(socket)

  const stillConnected = Array.from(room.sockets).some((candidate) => {
    const info = socketMeta.get(candidate)
    return info?.userId === meta.userId
  })

  if (!stillConnected) {
    room.users.delete(meta.userId)
    room.selections.delete(meta.userId)
    broadcast(room, {
      type: 'presence:user_left',
      payload: { userId: meta.userId },
    })
  }

  cleanupEmptyRoom(meta.dashboardId)
}

function hasConnectedUser(room: PresenceRoom, userId: string): boolean {
  return Array.from(room.sockets).some((candidate) => {
    const info = socketMeta.get(candidate)
    return info?.userId === userId
  })
}

export const registerPresenceSocket: FastifyPluginAsync = async (fastify) => {
  await fastify.register(websocket)

  fastify.get('/ws', { websocket: true }, (socket) => {
    socket.on('message', (raw: Buffer) => {
      let event: SocketEvent
      try {
        event = JSON.parse(raw.toString()) as SocketEvent
      } catch {
        return
      }

      if (event.type === 'presence:join') {
        const { dashboardId } = event.payload
        const room = getRoom(dashboardId)
        const nextUser = hasConnectedUser(room, event.payload.user.userId)
          ? { ...event.payload.user, userId: randomUUID() }
          : event.payload.user

        room.sockets.add(socket)
        room.users.set(nextUser.userId, nextUser)
        socketMeta.set(socket, { dashboardId, userId: nextUser.userId })

        if (nextUser.userId !== event.payload.user.userId) {
          sendJson(socket, {
            type: 'presence:identity_assigned',
            payload: { user: nextUser },
          })
        }

        sendJson(socket, {
          type: 'presence:snapshot',
          payload: {
            users: Array.from(room.users.values()),
            cursors: [],
            selections: Array.from(room.selections.entries()).map(
              ([userId, selectedWidgetId]) => ({ userId, selectedWidgetId }),
            ),
          },
        })

        broadcast(room, {
          type: 'presence:user_joined',
          payload: nextUser,
        })
        return
      }

      if (event.type === 'selection:update') {
        const room = rooms.get(event.payload.dashboardId)
        if (!room) return
        room.selections.set(event.payload.userId, event.payload.selectedWidgetId)
        broadcast(room, {
          type: 'selection:updated',
          payload: {
            userId: event.payload.userId,
            selectedWidgetId: event.payload.selectedWidgetId,
          },
        })
        return
      }

      if (event.type === 'presence:leave') {
        leaveRoom(socket)
      }
    })

    socket.on('close', () => {
      leaveRoom(socket)
    })
  })
}
