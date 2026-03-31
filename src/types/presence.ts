import type {DashboardId, UserId, WidgetId} from './widget'

export type PresenceUser = {
  userId: UserId
  name: string
  color: string
}

export type RemoteCursor = {
  userId: UserId
  x: number
  y: number
  updatedAt: number
}

export type UserSelection = {
  userId: UserId
  selectedWidgetId: WidgetId | null
}

export type PresenceStateSnapshot = {
  users: PresenceUser[]
  cursors: RemoteCursor[]
  selections: UserSelection[]
}

export type ClientToServerEvent =
  | {
      type: 'presence:join'
      payload: {
        dashboardId: DashboardId
        user: PresenceUser
      }
    }
  | {
      type: 'cursor:move'
      payload: {
        dashboardId: DashboardId
        userId: UserId
        x: number
        y: number
      }
    }
  | {
      type: 'selection:update'
      payload: {
        dashboardId: DashboardId
        userId: UserId
        selectedWidgetId: WidgetId | null
      }
    }
  | {
      type: 'presence:leave'
      payload: {
        dashboardId: DashboardId
        userId: UserId
      }
    }

export type ServerToClientEvent =
  | {
      type: 'presence:snapshot'
      payload: PresenceStateSnapshot
    }
  | {
      type: 'presence:identity_assigned'
      payload: {
        user: PresenceUser
      }
    }
  | {
      type: 'presence:user_joined'
      payload: PresenceUser
    }
  | {
      type: 'presence:user_left'
      payload: {
        userId: UserId
      }
    }
  | {
      type: 'cursor:moved'
      payload: RemoteCursor
    }
  | {
      type: 'selection:updated'
      payload: UserSelection
    }
