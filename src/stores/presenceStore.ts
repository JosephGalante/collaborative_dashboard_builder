import { create } from 'zustand'
import type {
  PresenceStateSnapshot,
  PresenceUser,
  RemoteCursor,
  UserSelection,
} from '@/types/presence'
import type { UserId, WidgetId } from '@/types/widget'

type PresenceStore = {
  connectionStatus: 'disconnected' | 'connecting' | 'connected'
  currentUser: PresenceUser | null
  users: PresenceUser[]
  cursors: Record<UserId, RemoteCursor>
  selections: Record<UserId, WidgetId | null>
  setConnectionStatus: (status: PresenceStore['connectionStatus']) => void
  setCurrentUser: (user: PresenceUser) => void
  setSnapshot: (snapshot: PresenceStateSnapshot) => void
  upsertUser: (user: PresenceUser) => void
  removeUser: (userId: UserId) => void
  updateCursor: (cursor: RemoteCursor) => void
  removeCursor: (userId: UserId) => void
  updateSelection: (selection: UserSelection) => void
  clearSelection: (userId: UserId) => void
  resetPresence: () => void
}

const initialState = {
  connectionStatus: 'disconnected' as const,
  currentUser: null as PresenceUser | null,
  users: [] as PresenceUser[],
  cursors: {} as Record<UserId, RemoteCursor>,
  selections: {} as Record<UserId, WidgetId | null>,
}

export const usePresenceStore = create<PresenceStore>((set) => ({
  ...initialState,

  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setCurrentUser: (currentUser) => set({ currentUser }),

  setSnapshot: (snapshot) =>
    set({
      users: snapshot.users,
      cursors: Object.fromEntries(
        snapshot.cursors.map((cursor) => [cursor.userId, cursor]),
      ),
      selections: Object.fromEntries(
        snapshot.selections.map((selection) => [
          selection.userId,
          selection.selectedWidgetId,
        ]),
      ),
    }),

  upsertUser: (user) =>
    set((state) => {
      const hasUser = state.users.some((existing) => existing.userId === user.userId)
      return hasUser
        ? {
            users: state.users.map((existing) =>
              existing.userId === user.userId ? user : existing,
            ),
          }
        : { users: [...state.users, user] }
    }),

  removeUser: (userId) =>
    set((state) => {
      const cursors = { ...state.cursors }
      const selections = { ...state.selections }
      delete cursors[userId]
      delete selections[userId]
      return {
        users: state.users.filter((user) => user.userId !== userId),
        cursors,
        selections,
      }
    }),

  updateCursor: (cursor) =>
    set((state) => ({
      cursors: { ...state.cursors, [cursor.userId]: cursor },
    })),

  removeCursor: (userId) =>
    set((state) => {
      const cursors = { ...state.cursors }
      delete cursors[userId]
      return { cursors }
    }),

  updateSelection: (selection) =>
    set((state) => ({
      selections: {
        ...state.selections,
        [selection.userId]: selection.selectedWidgetId,
      },
    })),

  clearSelection: (userId) =>
    set((state) => {
      const selections = { ...state.selections }
      delete selections[userId]
      return { selections }
    }),

  resetPresence: () => set(initialState),
}))
